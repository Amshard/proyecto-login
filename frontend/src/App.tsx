import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CatalogoDescansos from './pages/Catalogos/CatalogoDescansos';
import CatalogoEstaciones from './pages/Catalogos/CatalogoEstaciones';
import CatalogoLineas from './pages/Catalogos/CatalogoLineas';
import CatalogoPermanencias from './pages/Catalogos/CatalogoPermanencias';
import CatalogoPersonal from './pages/Catalogos/CatalogoPersonal';
import CatalogoTaquillas from './pages/Catalogos/CatalogoTaquillas';
import PersonalProvisional from './pages/Catalogos/PersonalProvisional';
import AgregaLugar from './pages/Procesos/AgregaLugar';
import CambioPosiciones from './pages/Procesos/CambioPosiciones';
import ConcentradoLineas from './pages/Procesos/ConcentradoLineas';
import RespaldaRolVigente from './pages/Procesos/RespaldaRolVigente';
import RolesTurnoLinea from './pages/Procesos/ParaCalificacion/RolesTurnoLinea';
import ActualizaCalificacion from './pages/Procesos/ParaCalificacion/ActualizaCalificacion';
import ActualizaIncidencias from './pages/Procesos/ParaCalificacion/ActualizaIncidencias';
import AsignacionIncidencias from './pages/Procesos/ParaCalificacion/AsignacionIncidencias';
import Califica from './pages/Procesos/ParaCalificacion/Califica';
import CargaIncidencias from './pages/Procesos/ParaCalificacion/CargaIncidencias';
import PreparaExpedientes from './pages/Procesos/ParaCalificacion/PreparaExpedientes';
import RolDescansos from './pages/Procesos/RolDescansos';
import Calificaciones from './pages/Reportes/Calificaciones';
import CategoriasTaquilla from './pages/Reportes/CategoriasTaquilla';
import DiasCompensados from './pages/Reportes/DiasCompensados';
import TotalesRolVigente from './pages/Reportes/TotalesRolVigente';
import VentasBoletos from './pages/Reportes/VentasBoletos';
import RolTaquilla from './pages/Reportes/RolTaquilla';
import ConcentradoAsistencia from './pages/Reportes/ConcentradoAsistencia';
import ConsultaCalificaciones from './pages/Consultas/ConsultaCalificaciones';
import UbicacionExpediente from './pages/Consultas/UbicacionExpediente';
import PeriodosVacacionales from './pages/Consultas/PeriodosVacacionales';
import CapturaPeriodos from './pages/Vacaciones/CapturaPeriodos';
import CapturaSolicitudes from './pages/Vacaciones/CapturaSolicitudes';
import GeneraComparativo from './pages/Vacaciones/GeneraComparativo';
import GeneraProgramaAnual from './pages/Vacaciones/GeneraProgramaAnual';
import GeneraSolicitudesFaltantes from './pages/Vacaciones/GeneraSolicitudesFaltantes';
import InicioAnualVacaciones from './pages/Vacaciones/InicioAnualVacaciones';
import PromediaCalificaciones from './pages/Vacaciones/PromediaCalificaciones';
import ReasignaPeriodos from './pages/Vacaciones/ReasignaPeriodos';
import ReporteComparativo from './pages/Vacaciones/ReporteComparativo';
import ReporteConSinSolicitud from './pages/Vacaciones/ReporteConSinSolicitud';
import ReportesProgramaAnual from './pages/Vacaciones/ReportesProgramaAnual';
import Usuarios from './pages/Utilerias/Usuarios';
import AntiguedadSTC from './pages/Utilerias/ParametrosCalificacion/AntiguedadSTC';
import Asistencia from './pages/Utilerias/ParametrosCalificacion/Asistencia';
import Puntualidad from './pages/Utilerias/ParametrosCalificacion/Puntualidad';
import RolesLineaTurno from './pages/Utilerias/ParametrosCalificacion/RolesLineaTurno';
import FaltanteEfectivo from './pages/Utilerias/ParametrosCalificacion/FaltanteEfectivo';
import FrecuenciaFE from './pages/Utilerias/ParametrosCalificacion/FrecuenciaFE';
import Sanciones from './pages/Utilerias/ParametrosCalificacion/Sanciones';
import CambiaRol from './pages/Utilerias/CambiaRol';
import Catorcenas from './pages/Utilerias/Catorcenas';
import PersonalTaquilla from './pages/AExcel/PersonalTaquilla';
import AExcelCalificaciones from './pages/AExcel/Calificaciones';
import PersonalVacaciones from './pages/AExcel/PersonalVacaciones';
import RolVigente from './pages/AExcel/RolVigente';
import RespaldaRolTaq from './pages/AExcel/RespaldaRolTaq';
import RespaldaPersonal from './pages/AExcel/RespaldaPersonal';
import RespaldaCalif from './pages/AExcel/RespaldaCalif';
import ChangePassword from './pages/Login/ChangePassword';
import Login from './pages/Login/Login';
import SectionPage from './pages/SectionPage';

const PROTECTED_ROUTES: [path: string, element: ReactElement][] = [
  ['/cambio-password', <ChangePassword />],
  ['/catalogos/permanencias', <CatalogoPermanencias />],
  ['/catalogos/lineas', <CatalogoLineas />],
  ['/catalogos/estaciones', <CatalogoEstaciones />],
  ['/catalogos/descansos', <CatalogoDescansos />],
  ['/catalogos/taquillas', <CatalogoTaquillas />],
  ['/catalogos/personal-de-taquilla', <CatalogoPersonal />],
  ['/catalogos/personal-provisional', <PersonalProvisional />],
  ['/procesos/respalda-rol-vigente', <RespaldaRolVigente />],
  ['/procesos/rol-de-descansos', <RolDescansos />],
  ['/procesos/para-calificacion/prepara-expedientes-para-asignar-incidencias', <PreparaExpedientes />],
  ['/procesos/para-calificacion/carga-incidencias-desde-archivos-excel', <CargaIncidencias />],
  ['/procesos/para-calificacion/asignacion-de-incidencias', <AsignacionIncidencias />],
  ['/procesos/para-calificacion/roles-por-turno-y-linea-promedia-calificacion', <RolesTurnoLinea />],
  ['/procesos/para-calificacion/califica', <Califica />],
  ['/procesos/para-calificacion/actualiza-incidencias-x-expediente', <ActualizaIncidencias />],
  ['/procesos/para-calificacion/actualiza-calificacion-x-rango-por-cambio-de-linea-y-turno', <ActualizaCalificacion />],
  ['/procesos/cambio-de-posiciones-en-el-rol', <CambioPosiciones />],
  ['/procesos/agrega-un-lugar-en-el-rol', <AgregaLugar />],
  ['/procesos/excel-concentrado-de-lineas-turnos-x-exp', <ConcentradoLineas />],
  ['/reportes/calificaciones', <Calificaciones />],
  ['/reportes/rol-taquilla', <RolTaquilla />],
  ['/reportes/categorias-en-taquilla', <CategoriasTaquilla />],
  ['/reportes/dias-compensados', <DiasCompensados />],
  ['/reportes/concentrado-para-asistencia', <ConcentradoAsistencia />],
  ['/reportes/totales-del-rol-vigente-por-permanencia-y-periodos', <TotalesRolVigente />],
  ['/reportes/ventas-boletos-recargas-y-tarjetas', <VentasBoletos />],
  ['/consultas/ubicacion-por-expediente', <UbicacionExpediente />],
  ['/consultas/calificaciones', <ConsultaCalificaciones />],
  ['/consultas/periodos-vacacionales-por-expediente', <PeriodosVacacionales />],
  ['/vacaciones/inicio-anual-de-vacaciones', <InicioAnualVacaciones />],
  ['/vacaciones/genera-solicitudes-para-el-personal-faltante', <GeneraSolicitudesFaltantes />],
  ['/vacaciones/reporte-de-vacaciones-con-y-sin-solicitud', <ReporteConSinSolicitud />],
  ['/vacaciones/promedia-calificaciones', <PromediaCalificaciones />],
  ['/vacaciones/genera-prog-anual-de-vacaciones-asignacion', <GeneraProgramaAnual />],
  ['/vacaciones/genera-comparativo', <GeneraComparativo />],
  ['/vacaciones/reporte-comparativo-de-vacaciones-asignadas', <ReporteComparativo />],
  ['/vacaciones/reportes-del-programa-anual', <ReportesProgramaAnual />],
  ['/vacaciones/re-asigna-periodos-vacacionales-por-expediente', <ReasignaPeriodos />],
  ['/vacaciones/captura-periodos-vacacionales', <CapturaPeriodos />],
  ['/vacaciones/captura-de-solicitudes', <CapturaSolicitudes />],
  ['/utilerias/usuarios', <Usuarios />],
  ['/utilerias/parametros-para-calificacion/antiguedad-stc', <AntiguedadSTC />],
  ['/utilerias/parametros-para-calificacion/asistencia-faltas', <Asistencia />],
  ['/utilerias/parametros-para-calificacion/puntualidad-retardos', <Puntualidad />],
  ['/utilerias/parametros-para-calificacion/roles-en-la-linea-y-en-el-turno', <RolesLineaTurno />],
  ['/utilerias/parametros-para-calificacion/faltante-de-efectivo', <FaltanteEfectivo />],
  ['/utilerias/parametros-para-calificacion/fecuencia-fe', <FrecuenciaFE />],
  ['/utilerias/parametros-para-calificacion/sanciones', <Sanciones />],
  ['/utilerias/cambia-de-rol-y-captura-roles-en-el-ano', <CambiaRol />],
  ['/utilerias/captura-catorcenas-del-ano', <Catorcenas />],
  ['/a-excel/personal-de-taquilla', <PersonalTaquilla />],
  ['/a-excel/calificaciones', <AExcelCalificaciones />],
  ['/a-excel/personal-vacaciones', <PersonalVacaciones />],
  ['/a-excel/rol-vigente-para-dias-economicos', <RolVigente />],
  ['/a-excel/respalda-rol-de-taquilla', <RespaldaRolTaq />],
  ['/a-excel/respalda-personal-de-taquilla', <RespaldaPersonal />],
  ['/a-excel/respalda-calificaciones', <RespaldaCalif />],
  ['/:section/:item', <SectionPage />],
  ['/:section/:group/:item', <SectionPage />],
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      {PROTECTED_ROUTES.map(([path, element]) => (
        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
      ))}
    </Routes>
  );
}

export default App;
