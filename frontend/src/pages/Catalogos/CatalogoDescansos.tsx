import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDescansos, type Descanso } from '../../api/catalogos';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface DescansoForm {
    id_descansos: string;
    iniciales: string;
    descanso1: string;
    descanso2: string;
}

const EMPTY_FORM: DescansoForm = { id_descansos: '', iniciales: '', descanso1: '', descanso2: '' };

export default function CatalogoDescansos() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<DescansoForm>(EMPTY_FORM);
    const [rows, setRows] = useState<Descanso[]>([]);
    const [formError, setFormError] = useState(false);
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    useEffect(() => {
        let active = true;
        getDescansos()
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

    const updateField = (field: keyof DescansoForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value.toUpperCase() }));
        setFormError(false);
    };

    const handleSave = () => {
        const hasEmptyField = Object.values(form).some((value) => value.trim() === '');
        if (hasEmptyField) {
            setFormError(true);
            return;
        }
        setFormError(false);
        setRows((prev) => [...prev, form]);
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
                                Catálogo de Descansos
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
                                <div className="stc-manual-field" style={{ width: '56px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-clave">
                                        Clave
                                    </label>
                                    <input
                                        id="filtro-clave"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        value={form.id_descansos}
                                        onChange={(e) => updateField('id_descansos', e.target.value)}
                                        style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '56px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-iniciales">
                                        Iniciales
                                    </label>
                                    <input
                                        id="filtro-iniciales"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={2}
                                        value={form.iniciales}
                                        onChange={(e) => updateField('iniciales', e.target.value)}
                                        style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '150px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-descanso1">
                                        Descanso 1
                                    </label>
                                    <input
                                        id="filtro-descanso1"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={10}
                                        value={form.descanso1}
                                        onChange={(e) => updateField('descanso1', e.target.value)}
                                        style={{ width: '150px', height: '36px', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '150px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-descanso2">
                                        Descanso 2
                                    </label>
                                    <input
                                        id="filtro-descanso2"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={10}
                                        value={form.descanso2}
                                        onChange={(e) => updateField('descanso2', e.target.value)}
                                        style={{ width: '150px', height: '36px', textTransform: 'uppercase' }}
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
                                        Descansos de la red
                                    </legend>
                                    <div className="stc-table-scroll">
                                        <table className="stc-table stc-table-descansos">
                                            <thead>
                                                <tr>
                                                    <th>Clave</th>
                                                    <th>Iniciales</th>
                                                    <th>Descanso 1</th>
                                                    <th>Descanso 2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.length === 0 ? (
                                                    <tr>
                                                    </tr>
                                                ) : (
                                                    rows.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{row.id_descansos}</td>
                                                            <td>{row.iniciales}</td>
                                                            <td>{row.descanso1}</td>
                                                            <td>{row.descanso2}</td>
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
                <span className="stc-status-square">Catálogo de Descansos</span>
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
