import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface PersonalProvisionalForm {
    expediente: string;
    permiso: string;
    nombre: string;
    jub: string;
    genero: string;
    ingreso: string;
    posicionRol: string;
    tramo: string;
    faltas: string;
    taquilla: string;
    categoria: string;
    descansos: string;
    lugar: string;
    calificacion: string;
    turno: string;
    perm: string;
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

const EMPTY_FORM: PersonalProvisionalForm = {
    expediente: '',
    permiso: '',
    nombre: '',
    jub: '',
    genero: '',
    ingreso: '',
    posicionRol: '',
    tramo: '',
    faltas: '',
    taquilla: '',
    categoria: '',
    descansos: '',
    lugar: '',
    calificacion: '',
    turno: '',
    perm: '',
};

export default function PersonalProvisional() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<PersonalProvisionalForm>(EMPTY_FORM);
    const [rows, setRows] = useState<PersonalProvisionalForm[]>([]);
    const today = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const handleClear = () => {
        setForm(EMPTY_FORM);
    };

    const handleSave = () => {
        setRows((prev) => [...prev, form]);
        setForm(EMPTY_FORM);
    };

    const updateField = (field: keyof PersonalProvisionalForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: field === 'ingreso' ? value : value.toUpperCase(),
        }));
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
                                        <button
                    type="button"
                    className="stc-exit-btn stc-report-ops-btn"
                    onClick={() => setActiveTab('nuevo')}
                >
                    Calificacion
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
                                <div className="stc-provisional-form">
                                    <div className="stc-manual-fields">
                                        <div className="stc-manual-field" style={{ width: '110px' }}>
                                            <label className="stc-field-label" htmlFor="prov-expediente">
                                                Expediente
                                            </label>
                                            <input
                                                id="prov-expediente"
                                                className="stc-field-input"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={form.expediente}
                                                onChange={(e) => updateField('expediente', e.target.value)}
                                                style={{ width: '90px', height: '36px', textAlign: 'center' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-permiso">
                                                Permiso
                                            </label>
                                            <input
                                                id="prov-permiso"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={1}
                                                value={form.permiso}
                                                onChange={(e) => updateField('permiso', e.target.value)}
                                                style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '280px' }}>
                                            <label className="stc-field-label" htmlFor="prov-nombre">
                                                Nombre
                                            </label>
                                            <input
                                                id="prov-nombre"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={50}
                                                value={form.nombre}
                                                onChange={(e) => updateField('nombre', e.target.value)}
                                                style={{ width: '280px', height: '36px', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-jub">
                                                Jub
                                            </label>
                                            <input
                                                id="prov-jub"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={1}
                                                value={form.jub}
                                                onChange={(e) => updateField('jub', e.target.value)}
                                                style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-genero">
                                                Genero
                                            </label>
                                            <input
                                                id="prov-genero"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={1}
                                                value={form.genero}
                                                onChange={(e) => updateField('genero', e.target.value)}
                                                style={{ width: '25px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '150px' }}>
                                            <label className="stc-field-label" htmlFor="prov-ingreso">
                                                Ingreso
                                            </label>
                                            <input
                                                id="prov-ingreso"
                                                className="stc-field-input"
                                                type="date"
                                                value={form.ingreso}
                                                onChange={(e) => updateField('ingreso', e.target.value)}
                                                style={{ width: '150px', height: '36px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="stc-manual-fields stc-manual-fields-small">
                                        <div className="stc-manual-field" style={{ width: '104px', textAlign: 'left' }}>
                                            <label className="stc-field-label" htmlFor="prov-posicion-rol">
                                                Posición en el ROL
                                            </label>
                                            <input
                                                id="prov-posicion-rol"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.posicionRol}
                                                onChange={(e) => updateField('posicionRol', e.target.value)}
                                                style={{ width: '100px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-tramo">
                                                Tramo
                                            </label>
                                            <input
                                                id="prov-tramo"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.tramo}
                                                onChange={(e) => updateField('tramo', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-faltas">
                                                Faltas
                                            </label>
                                            <input
                                                id="prov-faltas"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.faltas}
                                                onChange={(e) => updateField('faltas', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-taquilla">
                                                Taquilla
                                            </label>
                                            <input
                                                id="prov-taquilla"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.taquilla}
                                                onChange={(e) => updateField('taquilla', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-categoria">
                                                Categoria
                                            </label>
                                            <input
                                                id="prov-categoria"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.categoria}
                                                onChange={(e) => updateField('categoria', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-descansos">
                                                Descansos
                                            </label>
                                            <input
                                                id="prov-descansos"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.descansos}
                                                onChange={(e) => updateField('descansos', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-lugar">
                                                Lugar
                                            </label>
                                            <input
                                                id="prov-lugar"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.lugar}
                                                onChange={(e) => updateField('lugar', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-calificacion">
                                                Calificacion
                                            </label>
                                            <input
                                                id="prov-calificacion"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.calificacion}
                                                onChange={(e) => updateField('calificacion', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-turno">
                                                Turno
                                            </label>
                                            <input
                                                id="prov-turno"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.turno}
                                                onChange={(e) => updateField('turno', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>

                                        <div className="stc-manual-field" style={{ width: '70px' }}>
                                            <label className="stc-field-label" htmlFor="prov-perm">
                                                Perm
                                            </label>
                                            <input
                                                id="prov-perm"
                                                className="stc-field-input"
                                                type="text"
                                                maxLength={4}
                                                value={form.perm}
                                                onChange={(e) => updateField('perm', e.target.value)}
                                                style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                            />
                                        </div>
                                    </div>

                                    <fieldset className="stc-table-frame">
                                        <legend className="stc-table-frame-title">
                                            Personal Provisional
                                        </legend>
                                        <div className="stc-table-scroll">
                                            <table className="stc-table stc-table-provisional">
                                                <thead>
                                                    <tr>
                                                        <th>Expediente</th>
                                                        <th>Permiso</th>
                                                        <th>Fecha inicio</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows.length === 0 ? (
                                                        <tr>
                                                        </tr>
                                                    ) : (
                                                        rows.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>{row.expediente}</td>
                                                                <td>{row.permiso}</td>
                                                                <td>{formatFecha(row.ingreso)}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </fieldset>
                                </div>
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
