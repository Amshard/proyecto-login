import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTaquillas, type Taquilla } from '../../api/catalogos';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface TaquillaForm {
    id_taquilla: string;
    turno: string;
    dirdelinea: string;
    extension_tel: string;
    id_linea: string;
    id_estacion: string;
}

const EMPTY_FORM: TaquillaForm = {
    id_taquilla: '',
    turno: '',
    dirdelinea: '',
    extension_tel: '',
    id_linea: '',
    id_estacion: '',
};

export default function CatalogoTaquillas() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<TaquillaForm>(EMPTY_FORM);
    const [rows, setRows] = useState<Taquilla[]>([]);
    const [formError, setFormError] = useState(false);
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    useEffect(() => {
        let active = true;
        getTaquillas()
            .then((data) => {
                if (!active) return;
                setRows(data);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const handleClear = () => {
        setForm(EMPTY_FORM);
        setFormError(false);
    };

    const updateField = (field: keyof TaquillaForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value.toUpperCase() }));
        setFormError(false);
    };

    const handleSave = () => {
        const hasEmptyField = Object.entries(form).some(
            ([field, value]) => field !== 'extension_tel' && value.trim() === ''
        );
        if (hasEmptyField) {
            setFormError(true);
            return;
        }
        setFormError(false);
        setRows((prev) => [
            ...prev,
            {
                id_taquilla: form.id_taquilla,
                turno: form.turno,
                dirdelinea: Number(form.dirdelinea) || 0,
                extension_tel: form.extension_tel || null,
                id_linea: form.id_linea,
                id_estacion: form.id_estacion,
            },
        ]);
    };

    return (
        <div className="stc-login-page">

            <header className="stc-header">
                {activeTab === 'catalogo' && (
                    <>
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
                    </>
                )}
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
                                Catálogo de Taquillas y sus Turnos
                            </button>
                            <button
                                type="button"
                                className={`stc-tab-btn${activeTab === 'nuevo' ? ' stc-tab-btn-active' : ''}`}
                                onClick={() => setActiveTab('nuevo')}
                            >
                                Reporte
                            </button>
                        </div>

                        {activeTab === 'catalogo' && (
                            <div className="stc-manual-fields">
                                <div className="stc-manual-field" style={{ width: '80px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-id-taquilla">
                                        Taquilla
                                    </label>
                                    <input
                                        id="filtro-id-taquilla"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={5}
                                        value={form.id_taquilla}
                                        onChange={(e) => updateField('id_taquilla', e.target.value)}
                                        style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '56px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-turno">
                                        Turno
                                    </label>
                                    <input
                                        id="filtro-turno"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={1}
                                        value={form.turno}
                                        onChange={(e) => updateField('turno', e.target.value)}
                                        style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '90px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-dirdelinea">
                                        Dir. Línea
                                    </label>
                                    <input
                                        id="filtro-dirdelinea"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={form.dirdelinea}
                                        onChange={(e) => updateField('dirdelinea', e.target.value)}
                                        style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '130px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-extension">
                                        Extensión
                                    </label>
                                    <input
                                        id="filtro-extension"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={10}
                                        value={form.extension_tel}
                                        onChange={(e) => updateField('extension_tel', e.target.value)}
                                        style={{ width: '110px', height: '36px', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '56px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-linea">
                                        Línea
                                    </label>
                                    <input
                                        id="filtro-linea"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        value={form.id_linea}
                                        onChange={(e) => updateField('id_linea', e.target.value)}
                                        style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '56px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-estacion">
                                        Estación
                                    </label>
                                    <input
                                        id="filtro-estacion"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        value={form.id_estacion}
                                        onChange={(e) => updateField('id_estacion', e.target.value)}
                                        style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'catalogo' && formError && (
                            <div className="stc-form-error">
                                Por favor llene todos los campos antes de guardar.
                            </div>
                        )}

                        <div className="stc-changepw-body stc-tab-panel">
                            {activeTab === 'catalogo' ? (
                                <fieldset className="stc-table-frame">
                                    <legend className="stc-table-frame-title">
                                        Taquillas de la red
                                    </legend>
                                    <div className="stc-table-scroll">
                                        <table className="stc-table stc-table-taquillas">
                                            <thead>
                                                <tr>
                                                    <th>Taquilla</th>
                                                    <th>Estación</th>
                                                    <th>Turno</th>
                                                    <th>DirLin</th>
                                                    <th>Dirección</th>
                                                    <th>ExtTel</th>
                                                    <th>Línea</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.length === 0 ? (
                                                    <tr>
                                                    </tr>
                                                ) : (
                                                    rows.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{row.id_taquilla}</td>
                                                            <td>{row.id_estacion}</td>
                                                            <td>{row.turno}</td>
                                                            <td>{row.dirdelinea}</td>
                                                            <td>{row.direccion?.trim() ? row.direccion : 'SIN DIRECCION DE LINEA'}</td>
                                                            <td>{row.extension_tel}</td>
                                                            <td>{row.id_linea}</td>
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
                <span className="stc-status-square">Catálogo de Taquillas</span>
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
