import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <aside className="filters-sidebar">
            <h3>Filtres</h3>

            <div className="filter-group">
                <label htmlFor="level">Niveau</label>
                <select name="level" id="level" value={filters.level} onChange={handleChange}>
                    <option value="">Tous les niveaux</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Elite">Elite</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Type de Défi</label>
                <div className="radio-group">
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="type"
                            value=""
                            checked={filters.type === ""}
                            onChange={handleChange}
                        />
                        Tous
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="type"
                            value="Cyclosportive"
                            checked={filters.type === "Cyclosportive"}
                            onChange={handleChange}
                        />
                        Cyclosportive
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="type"
                            value="Randonnée / Tourisme"
                            checked={filters.type === "Randonnée / Tourisme"}
                            onChange={handleChange}
                        />
                        Randonnée
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="type"
                            value="Ultra-Distance"
                            checked={filters.type === "Ultra-Distance"}
                            onChange={handleChange}
                        />
                        Ultra-Distance
                    </label>
                </div>
            </div>

            <div className="filter-group">
                <label htmlFor="terrain">Terrain</label>
                <select name="terrain" id="terrain" value={filters.terrain} onChange={handleChange}>
                    <option value="">Tous terrains</option>
                    <option value="Montagne">Montagne</option>
                    <option value="Vallonné">Vallonné</option>
                    <option value="Plat">Plat</option>
                </select>
            </div>
        </aside>
    );
};

export default Filters;
