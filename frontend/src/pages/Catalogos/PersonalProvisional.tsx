import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPersonalRespaldo, type PersonalRespaldo } from '../../api/catalogos';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface PersonalProvisionalRow {
    id_expediente: number;
    permiso: string;
    fecha_ingreso: string;
}

function formatFecha(value: string): string {
    if (!value) return '';
    const fecha = new Date(value);
    if (Number.isNaN(fecha.getTime())) return value;
    return fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export default function PersonalProvisional() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [rows, setRows] = useState<PersonalProvisionalRow[]>([]);
    const today = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    useEffect(() => {
        let active = true;
        getPersonalRespaldo()
            .then((data: PersonalRespaldo[]) => {
                if (!active) return;
                setRows(
                    data.map((p) => ({
                        id_expediente: p.id_expediente,
                        permiso: '',
                        fecha_ingreso: p.fecha_ingreso,
                    }))
                );
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const updatePermiso = (index: number, value: string) => {
        setRows((prev) =>
            prev.map((row, i) => (i === index ? { ...row, permiso: value.toUpperCase() } : row))
        );
    };

    return (
        <div className="stc-login-page">

            <header className="stc-header">
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

            <div className="stc-body stc-catalogo-body">
                <main className="stc-content">
                    <div className="stc-registros-wrapper">
                        {activeTab === 'catalogo' && (
                            <div className="stc-registros-row">
                                <span className="stc-registros-label">Registros</span>
                                <div className="stc-registros-box">{rows.length}</div>
                            </div>
                        )}

                        <div className="stc-content-square stc-changepw-box">
                        <div className="stc-tabs">
                            <button
                                type="button"
                                className={`stc-tab-btn${activeTab === 'catalogo' ? ' stc-tab-btn-active' : ''}`}
                                onClick={() => setActiveTab('catalogo')}
                            >
                                Personal Provisional
                            </button>
                            <button
                                type="button"
                                className={`stc-tab-btn${activeTab === 'nuevo' ? ' stc-tab-btn-active' : ''}`}
                                onClick={() => setActiveTab('nuevo')}
                            >
                                Reporte
                            </button>
                        </div>

                        <div className="stc-changepw-body stc-tab-panel">
                            {activeTab === 'catalogo' ? (
                                <fieldset className="stc-table-frame">
                                    <legend className="stc-table-frame-title">
                                        Personal Provisional
                                    </legend>
                                    <div className="stc-table-scroll">
                                        <table className="stc-table stc-table-personal">
                                            <thead>
                                                <tr>
                                                    <th>Expediente</th>
                                                    <th>Permiso</th>
                                                    <th>Fecha de Ingreso</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.length === 0 ? (
                                                    <tr>
                                                    </tr>
                                                ) : (
                                                    rows.map((row, index) => (
                                                        <tr key={row.id_expediente}>
                                                            <td>{row.id_expediente}</td>
                                                            <td>
                                                                <input
                                                                    className="stc-field-input"
                                                                    type="text"
                                                                    maxLength={1}
                                                                    value={row.permiso}
                                                                    onChange={(e) => updatePermiso(index, e.target.value)}
                                                                    style={{ width: '25px', height: '26px', textAlign: 'center', textTransform: 'uppercase' }}
                                                                />
                                                            </td>
                                                            <td>{formatFecha(row.fecha_ingreso)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                            ) : (
                                <iframe
                                    className="stc-report-viewer"
                                    src="/blank.pdf"
                                    title="Reporte"
                                />
                            )}
                        </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="stc-status-bar">
                <span className="stc-status-square">Catálogo de Personal Provisional</span>
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
