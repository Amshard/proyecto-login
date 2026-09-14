import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface RegistroForm {
    clave: string;
    nombre: string;
    descripcion: string;
}

const EMPTY_FORM: RegistroForm = { clave: '', nombre: '', descripcion: '' };

interface CatalogoGenericoProps {
    title: string;
}

export default function CatalogoGenerico({ title }: CatalogoGenericoProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<RegistroForm>(EMPTY_FORM);
    const [rows, setRows] = useState<RegistroForm[]>([]);
    const [formError, setFormError] = useState(false);
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const handleClear = () => {
        setForm(EMPTY_FORM);
        setFormError(false);
    };

    const updateField = (field: keyof RegistroForm, value: string) => {
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

                        {activeTab === 'catalogo' && (
                            <div className="stc-manual-fields">
                                <div className="stc-manual-field" style={{ width: '110px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-clave">
                                        Clave
                                    </label>
                                    <input
                                        id="filtro-clave"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={8}
                                        value={form.clave}
                                        onChange={(e) => updateField('clave', e.target.value)}
                                        style={{ width: '110px', height: '36px', textTransform: 'uppercase' }}
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
                                        onChange={(e) => updateField('nombre', e.target.value)}
                                        style={{ width: '220px', height: '36px', textTransform: 'uppercase' }}
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
                                        onChange={(e) => updateField('descripcion', e.target.value)}
                                        style={{ width: '280px', height: '36px', textTransform: 'uppercase' }}
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
                                        {title}
                                    </legend>
                                    <div className="stc-table-scroll">
                                        <table className="stc-table">
                                            <thead>
                                                <tr>
                                                    <th>Clave</th>
                                                    <th>Nombre</th>
                                                    <th>Descripcion</th>
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
                <span className="stc-status-square">{title}</span>
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
