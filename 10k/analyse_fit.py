import fitdecode
import pandas as pd
import numpy as np

# === CONFIGURATION ===
file_path = "20674933700_ACTIVITY.fit"  # ton fichier .fit
DIST_EFFORT_MIN = 250      # m
DIST_EFFORT_MAX = 350      # m
DIST_RECUP_MIN = 80        # m
DIST_RECUP_MAX = 150       # m
VITESSE_SEUIL_MPS = 3.6    # ~3'20/km, au-delà = effort
PAUSE_SEUIL_MPS = 2.0      # en dessous ≈ récup active

# === LECTURE DU FICHIER FIT ===
records = []
with fitdecode.FitReader(file_path) as fit:
    for frame in fit:
        if frame.frame_type == fitdecode.FIT_FRAME_DATA and frame.name == "record":
            rec = {d.name: d.value for d in frame.fields}

            # Détection auto des noms possibles
            distance = rec.get("distance") or rec.get("enhanced_distance")
            speed = rec.get("speed") or rec.get("enhanced_speed")
            hr = rec.get("heart_rate")

            if rec.get("timestamp") and distance is not None:
                records.append({
                    "time": rec.get("timestamp"),
                    "distance_m": float(distance),
                    "speed_mps": float(speed) if speed is not None else np.nan,
                    "hr": float(hr) if hr is not None else np.nan
                })


df = pd.DataFrame(records).dropna(subset=["distance_m"])
df = df.sort_values("time").reset_index(drop=True)
df["elapsed_s"] = (df["time"] - df["time"].iloc[0]).dt.total_seconds()

# === LISSEMENT + DÉTECTION DES PHASES ===
df["speed_smooth"] = df["speed_mps"].rolling(10, min_periods=1, center=True).mean()

# Label effort / récup en fonction de la vitesse lissée
df["phase"] = np.where(df["speed_smooth"] >= VITESSE_SEUIL_MPS, "effort",
                       np.where(df["speed_smooth"] <= PAUSE_SEUIL_MPS, "recup", "transition"))

# On regroupe les phases contiguës
segments = []
in_segment = False
start_idx = None
current_phase = None

for i, phase in enumerate(df["phase"]):
    if not in_segment:
        in_segment = True
        start_idx = i
        current_phase = phase
    elif phase != current_phase:
        # fin de segment
        end_idx = i
        seg = df.iloc[start_idx:end_idx]
        dist = seg["distance_m"].iloc[-1] - seg["distance_m"].iloc[0]
        duree = seg["elapsed_s"].iloc[-1] - seg["elapsed_s"].iloc[0]
        segments.append({
            "phase": current_phase,
            "distance_m": dist,
            "duree_s": duree,
            "vitesse_moy": dist / duree if duree > 0 else np.nan,
            "fc_moy": seg["hr"].mean(),
            "fc_max": seg["hr"].max(),
            "start_time": seg["time"].iloc[0]
        })
        in_segment = True
        start_idx = i
        current_phase = phase

# === FILTRAGE des efforts & récup ===
laps = pd.DataFrame(segments)
if "distance_m" not in laps.columns:
    print("❌ Aucune donnée de distance détectée — vérifie ton .fit ou le seuil de vitesse.")
    print(f"Colonnes disponibles : {list(laps.columns)}")
    efforts = pd.DataFrame()
    recups = pd.DataFrame()
else:
    # Filtrage plus robuste sans query()
    efforts = laps[
        (laps["phase"] == "effort") &
        (laps["distance_m"].between(DIST_EFFORT_MIN, DIST_EFFORT_MAX))
    ].copy()

    recups = laps[
        (laps["phase"] != "effort") &
        (laps["distance_m"].between(DIST_RECUP_MIN, DIST_RECUP_MAX))
    ].copy()


# Numérotation des séries
efforts["rep"] = range(1, len(efforts) + 1)
recups["rep"] = range(1, len(recups) + 1)

# Calcul des allures
for df_ in (efforts, recups):
    df_["allure_sec_km"] = 1000 / df_["vitesse_moy"]
    df_["allure_min_km"] = df_["allure_sec_km"] / 60
    df_["allure_format"] = df_["allure_min_km"].apply(lambda x: f"{int(x)}'{int((x%1)*60):02d}\"" if pd.notnull(x) else None)

# === RÉSUMÉ ===
print("\n===== 🏁 EFFORTS (300 m) =====")
print(efforts[["rep", "distance_m", "duree_s", "allure_format", "fc_moy", "fc_max"]])

print("\n===== 💨 RÉCUPÉRATIONS (~100 m) =====")
print(recups[["rep", "distance_m", "duree_s", "allure_format", "fc_moy", "fc_max"]])

# Statistiques synthétiques
if not efforts.empty:
    print("\n===== 📊 SYNTHÈSE =====")
    print(f"Allure moyenne : {efforts['allure_min_km'].mean():.2f} min/km")
    print(f"Régularité (CV allure) : {efforts['allure_min_km'].std()/efforts['allure_min_km'].mean()*100:.2f}%")
    print(f"FC moyenne effort : {efforts['fc_moy'].mean():.0f} bpm")
    print(f"FC max moyenne : {efforts['fc_max'].mean():.0f} bpm")
