import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLineas, getPermanencias, type Linea } from '../../api/catalogos';
import '../Login/Login.css';
import './Catalogos.css';

type TabKey = 'catalogo' | 'nuevo';

interface LineaConPermanencia extends Linea {
    nombre_perma: string | null;
    descripcion: string | null;
}

interface LineaForm {
    id_linea: string;
    dirdelinea1: string;
    nombre_dirlin1: string;
    dirdelinea2: string;
    nombre_dirlin2: string;
    estaciones: string;
    taquillas: string;
    tramos: string;
    id_permanencia: string;
    nombre_perma: string;
    descripcion: string;
}

const EMPTY_FORM: LineaForm = {
    id_linea: '',
    dirdelinea1: '1',
    nombre_dirlin1: '',
    dirdelinea2: '2',
    nombre_dirlin2: '',
    estaciones: '',
    taquillas: '',
    tramos: '',
    id_permanencia: '',
    nombre_perma: '',
    descripcion: '',
};

export default function CatalogoLineas() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabKey>('catalogo');
    const [form, setForm] = useState<LineaForm>(EMPTY_FORM);
    const [rows, setRows] = useState<LineaConPermanencia[]>([]);
    const [formError, setFormError] = useState(false);
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    useEffect(() => {
        let active = true;
        Promise.all([getLineas(), getPermanencias()])
            .then(([lineas, permanencias]) => {
                if (!active) return;
                const permanenciaPorId = new Map(
                    permanencias.map((p) => [p.id_permanencia, p])
                );
                setRows(
                    lineas.map((linea) => {
                        const permanencia = linea.id_permanencia
                            ? permanenciaPorId.get(linea.id_permanencia)
                            : undefined;
                        return {
                            ...linea,
                            nombre_perma: permanencia?.nombre_perma ?? null,
                            descripcion: permanencia?.descripcion ?? null,
                        };
                    })
                );
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

    const updateField = (field: keyof LineaForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value.toUpperCase() }));
        setFormError(false);
    };

    const handleSave = () => {
        const requiredFields: (keyof LineaForm)[] = [
            'id_linea',
            'dirdelinea1',
            'nombre_dirlin1',
            'dirdelinea2',
            'nombre_dirlin2',
        ];
        const hasEmptyField = requiredFields.some((field) => form[field].trim() === '');
        if (hasEmptyField) {
            setFormError(true);
            return;
        }
        setFormError(false);
        setRows((prev) => [
            ...prev,
            {
                id_linea: form.id_linea,
                dirdelinea1: Number(form.dirdelinea1) || 0,
                nombre_dirlin1: form.nombre_dirlin1,
                dirdelinea2: Number(form.dirdelinea2) || 0,
                nombre_dirlin2: form.nombre_dirlin2,
                estaciones: form.estaciones ? Number(form.estaciones) : null,
                taquillas: form.taquillas ? Number(form.taquillas) : null,
                tramos: form.tramos ? Number(form.tramos) : null,
                id_permanencia: form.id_permanencia || null,
                nombre_perma: form.nombre_perma || null,
                descripcion: form.descripcion || null,
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
                                Catálogo de Líneas
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

                                <div className="stc-manual-field" style={{ width: '70px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-dirdelinea1">
                                        DirIni
                                    </label>
                                    <input
                                        id="filtro-dirdelinea1"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={form.dirdelinea1}
                                        onChange={(e) => updateField('dirdelinea1', e.target.value)}
                                        style={{ width: '50px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '150px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-nombre-dirlin1">
                                        Nombre Dirdelinea1
                                    </label>
                                    <input
                                        id="filtro-nombre-dirlin1"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={20}
                                        value={form.nombre_dirlin1}
                                        onChange={(e) => updateField('nombre_dirlin1', e.target.value)}
                                        style={{ width: '150px', height: '36px', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '70px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-dirdelinea2">
                                        DirFin
                                    </label>
                                    <input
                                        id="filtro-dirdelinea2"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={form.dirdelinea2}
                                        onChange={(e) => updateField('dirdelinea2', e.target.value)}
                                        style={{ width: '50px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '150px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-nombre-dirlin2">
                                        Nombre Dirdelinea2
                                    </label>
                                    <input
                                        id="filtro-nombre-dirlin2"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={20}
                                        value={form.nombre_dirlin2}
                                        onChange={(e) => updateField('nombre_dirlin2', e.target.value)}
                                        style={{ width: '150px', height: '36px', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '80px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-estaciones">
                                        Estaciones
                                    </label>
                                    <input
                                        id="filtro-estaciones"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={form.estaciones}
                                        onChange={(e) => updateField('estaciones', e.target.value)}
                                        style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '80px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-taquillas">
                                        Taquillas
                                    </label>
                                    <input
                                        id="filtro-taquillas"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={form.taquillas}
                                        onChange={(e) => updateField('taquillas', e.target.value)}
                                        style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '70px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-tramos">
                                        Tramos
                                    </label>
                                    <input
                                        id="filtro-tramos"
                                        className="stc-field-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={form.tramos}
                                        onChange={(e) => updateField('tramos', e.target.value)}
                                        style={{ width: '60px', height: '30px', textAlign: 'center', textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div className="stc-manual-field" style={{ width: '80px' }}>
                                    <label className="stc-field-label" htmlFor="filtro-permanencia">
                                        Permanencia
                                    </label>
                                    <input
                                        id="filtro-permanencia"
                                        className="stc-field-input"
                                        type="text"
                                        maxLength={2}
                                        value={form.id_permanencia}
                                        onChange={(e) => updateField('id_permanencia', e.target.value)}
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
                                        Líneas de la red
                                    </legend>
                                    <div className="stc-table-scroll">
                                        <table className="stc-table stc-table-lineas">
                                            <thead>
                                                <tr>
                                                    <th>Línea</th>
                                                    <th>Dirección</th>
                                                    <th>Estación Inicial</th>
                                                    <th>Dirección</th>
                                                    <th>Estación Terminal</th>
                                                    <th>Estaciones</th>
                                                    <th>Taquillas</th>
                                                    <th>Tramos</th>
                                                    <th>Permanencia</th>
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
                                                            <td>{row.id_linea}</td>
                                                            <td>{row.dirdelinea1}</td>
                                                            <td>{row.nombre_dirlin1}</td>
                                                            <td>{row.dirdelinea2}</td>
                                                            <td>{row.nombre_dirlin2}</td>
                                                            <td>{row.estaciones}</td>
                                                            <td>{row.taquillas}</td>
                                                            <td>{row.tramos}</td>
                                                            <td>{row.id_permanencia}</td>
                                                            <td>{row.nombre_perma}</td>
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
                <span className="stc-status-square">Catálogo de Líneas</span>
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
