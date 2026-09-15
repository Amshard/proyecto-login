import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPersonalTaquilla, type PersonalTaquilla } from '../../api/catalogos';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface PersonalForm {
    id_expediente: string;
    nombre: string;
    fecha_ingreso: string;
    prejubilacion: string;
    sexo: string;
}

const EMPTY_FORM: PersonalForm = { id_expediente: '', nombre: '', fecha_ingreso: '', prejubilacion: '', sexo: '' };

export default function CatalogoPersonal() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<PersonalForm>(EMPTY_FORM);
    const [rows, setRows] = useState<PersonalTaquilla[]>([]);
    const [formError, setFormError] = useState(false);
    const today = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    useEffect(() => {
        let active = true;
        getPersonalTaquilla()
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

    const updateField = (field: keyof PersonalForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: field === 'fecha_ingreso' ? value : value.toUpperCase(),
        }));
        setFormError(false);
    };

    const handleSave = () => {
        const hasEmptyField = Object.values(form).some((value) => value.trim() === '');
        if (hasEmptyField) {
            setFormError(true);
            return;
        }
        setFormError(false);
        setRows((prev) => [
            ...prev,
            {
                id_expediente: Number(form.id_expediente),
                nombre: form.nombre,
                fecha_ingreso: form.fecha_ingreso,
                prejubilacion: form.prejubilacion,
                sexo: form.sexo,
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
                                Personal de Taquilla
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
                                    <label className="stc-field-label" htmlFor="filtro-expediente">
                                        Expediente
                                    </label>
                                    <input
                                        id="filtro-expediente"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={form.id_expediente}
                                        onChange={(e) => updateField('id_expediente', e.target.value)}
                                        style={{ width: '90px', height: '36px', textAlign: 'center' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '280px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-nombre">
                                        Nombre
                                    </label>
                                    <input
                                        id="filtro-nombre"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={50}
                                        value={form.nombre}
                                        onChange={(e) => updateField('nombre', e.target.value)}
                                        style={{ width: '280px', height: '36px', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '150px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-fecha-ingreso">
                                        Fecha de Ingreso
                                    </label>
                                    <input
                                        id="filtro-fecha-ingreso"
                                        className="stc-field-input"
                                        type="date"
                                        value={form.fecha_ingreso}
                                        onChange={(e) => updateField('fecha_ingreso', e.target.value)}
                                        style={{ width: '150px', height: '36px' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '90px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-prejubilacion">
                                        Prejubilación
                                    </label>
                                    <input
                                        id="filtro-prejubilacion"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={1}
                                        value={form.prejubilacion}
                                        onChange={(e) => updateField('prejubilacion', e.target.value)}
                                        style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '70px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-sexo">
                                        Genero
                                    </label>
                                    <input
                                        id="filtro-sexo"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={1}
                                        value={form.sexo}
                                        onChange={(e) => updateField('sexo', e.target.value)}
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
                                        Personal de Taquilla
                                    </legend>
                                    <div className="stc-table-scroll">
                                        <table className="stc-table stc-table-personal">
                                            <thead>
                                                <tr>
                                                    <th>Expediente</th>
                                                    <th>Nombre</th>
                                                    <th>Fecha de Ingreso</th>
                                                    <th>Prejubilación</th>
                                                    <th>FoM</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.length === 0 ? (
                                                    <tr>
                                                    </tr>
                                                ) : (
                                                    rows.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{row.id_expediente}</td>
                                                            <td>{row.nombre}</td>
                                                            <td>{row.fecha_ingreso}</td>
                                                            <td>{row.prejubilacion}</td>
                                                            <td>{row.sexo}</td>
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
                <span className="stc-status-square">Catálogo de Personal de Taquilla</span>
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
