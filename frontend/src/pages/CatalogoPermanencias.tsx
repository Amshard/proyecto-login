import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface PermanenciaForm {
    clave: string;
    nombre: string;
    descripcion: string;
    siglas: string;
}

const EMPTY_FORM: PermanenciaForm = { clave: '', nombre: '', descripcion: '', siglas: '' };

export default function CatalogoPermanencias() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<PermanenciaForm>(EMPTY_FORM);
    const [rows, setRows] = useState<PermanenciaForm[]>([]);
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const handleClear = () => setForm(EMPTY_FORM);

    const handleSave = () => setRows((prev) => [...prev, form]);

    return (
        <div className="stc-login-page">

            <header className="stc-header">
                <button
                    type="button"
                    className="stc-exit-btn stc-clear-btn"
                    onClick={handleClear}
                >
                    Limpiar
                </button>
                <button
                    type="button"
                    className="stc-exit-btn stc-save-btn"
                    onClick={handleSave}
                >
                    Guardar
                </button>
                <button
                    type="button"
                    className="stc-exit-btn stc-salir-btn"
                    onClick={() => navigate('/dashboard')}
                >
                    Salir
                </button>
                <div className="stc-header-accent" />
                <div className="stc-header-text">
                    COORDINACIÓN DE TAQUILLA
                    <h1>SUBDIRECCION GENERAL DE ADMINISTRACION Y FINANZAS</h1>
                </div>
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-registros-wrapper">
                        <div className="stc-registros-row">
                            <span className="stc-registros-label">Registros</span>
                            <div className="stc-registros-box">{rows.length}</div>
                        </div>

                        <div className="stc-content-square stc-changepw-box">
                        <div className="stc-tabs">
                            <button
                                type="button"
                                className={`stc-tab-btn${activeTab === 'catalogo' ? ' stc-tab-btn-active' : ''}`}
                                onClick={() => setActiveTab('catalogo')}
                            >
                                Catálogo
                            </button>
                            <button
                                type="button"
                                className={`stc-tab-btn${activeTab === 'nuevo' ? ' stc-tab-btn-active' : ''}`}
                                onClick={() => setActiveTab('nuevo')}
                            >
                                Reporte
                            </button>
                        </div>

                        {/* Adjust each field's width/height below to size it manually */}
                        <div className="stc-manual-fields">
                            <div className="stc-manual-field" style={{ width: '56px' }}>
                                <label className="stc-field-label" htmlFor="filtro-clave">
                                    Permanencia
                                </label>
                                <input
                                    id="filtro-clave"
                                    className="stc-field-input"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={form.clave}
                                    onChange={(e) => setForm({ ...form, clave: e.target.value })}
                                    style={{ width: '25px', height: '30px', textAlign: 'center' }}
                                />
                            </div>

                            <div className="stc-manual-field" style={{ width: '220px' }}>
                                <label className="stc-field-label" htmlFor="filtro-nombre">
                                    Nombre
                                </label>
                                <input
                                    id="filtro-nombre"
                                    className="stc-field-input"
                                    type="text"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    style={{ width: '220px', height: '36px' }}
                                />
                            </div>

                            <div className="stc-manual-field" style={{ width: '280px' }}>
                                <label className="stc-field-label" htmlFor="filtro-descripcion">
                                    Descripcion
                                </label>
                                <input
                                    id="filtro-descripcion"
                                    className="stc-field-input"
                                    type="text"
                                    value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                    style={{ width: '280px', height: '36px' }}
                                />
                            </div>

                            <div className="stc-manual-field" style={{ width: '110px' }}>
                                <label className="stc-field-label" htmlFor="filtro-siglas">
                                    Siglas
                                </label>
                                <input
                                    id="filtro-siglas"
                                    className="stc-field-input"
                                    type="text"
                                    maxLength={8}
                                    value={form.siglas}
                                    onChange={(e) => setForm({ ...form, siglas: e.target.value.toUpperCase() })}
                                    style={{ width: '110px', height: '36px', textTransform: 'uppercase' }}
                                />
                            </div>
                        </div>

                        <div className="stc-changepw-body stc-tab-panel">
                            {activeTab === 'catalogo' ? (
                                <fieldset className="stc-table-frame">
                                    <legend className="stc-table-frame-title">
                                        Permanencias de la red
                                    </legend>
                                    <table className="stc-table">
                                        <thead>
                                            <tr>
                                                <th>Permanencia</th>
                                                <th>Nombre</th>
                                                <th>Descripcion</th>
                                                <th>Siglas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.length === 0 ? (
                                                <tr>
                                                </tr>
                                            ) : (
                                                rows.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{row.clave}</td>
                                                        <td>{row.nombre}</td>
                                                        <td>{row.descripcion}</td>
                                                        <td>{row.siglas}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </fieldset>
                            ) : (
                                <form className="stc-tab-form">

                                </form>
                            )}
                        </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="stc-status-bar">
                <span className="stc-status-square">Catálogo de Permanencias</span>
                <span className="stc-status-square">Usuario: {user?.nombre}</span>
                <span className="stc-status-square">{user?.rol_vigente?.nombre_rol}</span>
                <span className="stc-status-square">Vigencia: </span>
                <span className="stc-status-square">{user?.rol_vigente?.fecha_ini}</span>
                <span className="stc-status-square">{user?.rol_vigente?.fecha_fin}</span>
                <span className="stc-status-square">{user?.rol_vigente?.meses_q_califica}</span>
                <span className="stc-status-square">{today}</span>
            </footer>
        </div>
    );
}
