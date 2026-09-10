import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

type TabKey = 'catalogo' | 'nuevo';

export default function CatalogoPermanencias() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <div className="stc-login-page">

            <header className="stc-header">
                <button
                    type="button"
                    className="stc-exit-btn"
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
                    <div className="stc-content-square stc-changepw-box">
                        <div className="stc-changepw-titlebar">
                            Catálogo de Permanencias
                        </div>

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
                                Nueva Permanencia
                            </button>
                        </div>

                        <div className="stc-changepw-body stc-tab-panel">
                            {activeTab === 'catalogo' ? (
                                <table className="stc-table">
                                    <thead>
                                        <tr>
                                            <th>Clave</th>
                                            <th>Descripción</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="stc-table-empty">
                                                Sin registros
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <form className="stc-tab-form">
                                    <div className="stc-field-row">
                                        <label className="stc-field-label" htmlFor="clave">
                                            Clave
                                        </label>
                                        <input id="clave" className="stc-field-input" type="text" />
                                    </div>

                                    <div className="stc-field-row">
                                        <label className="stc-field-label" htmlFor="descripcion">
                                            Descripción
                                        </label>
                                        <input id="descripcion" className="stc-field-input" type="text" />
                                    </div>

                                    <button type="submit" className="stc-submit-btn stc-changepw-submit-btn">
                                        Guardar
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <footer className="stc-status-bar">
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
