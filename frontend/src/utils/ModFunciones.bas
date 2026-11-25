Attribute VB_Name = "ModFunciones"
Option Explicit
    'Programador:  Francisco Javier Garcia Zarate

    ''--------------------------------------------------------------------------------
''''    '----- SE CARGA LA FECHA DEL SISTEMA EN LA VARIABLE
''''    GDte_FechaCapt = Date
''''    GDte_FechaCapt = "30/04/2015"
''''    GStrMov_Anio = Year(GDte_FechaCapt)
''''    GDteMov_fecha = GDte_FechaCapt

Sub GCnCon()
On Error GoTo err1
   'Access
If GCnConexion.State = 0 Then
'   GCnConexion.ConnectionString = "DSN=odbcroltaq;DBQ=" & App.Path & "\BD_RolTaqSup.accdb" & ";DriverId=25;FIL=MS Access;MaxBufferSize=2048;PageTimeout=5;UID=admin;"
'   GCnConexion.Open GCnConexion.ConnectionString, "", ""

'   GCnConexion.ConnectionString = "DSN=odbcroltaq;UID=taq_adm;PWD=taquilla;WSID=50.192.40.24;DATABASE=BD_RolTaqSup"
'   GCnConexion.Open GCnConexion.ConnectionString, "taq_adm", "taquilla"

    GCnConexion.ConnectionString = "DSN=odbcroltaq;UID=usr_taquillas;PWD=Taquillas1234;WSID=50.192.41.212;DATABASE=BD_RolTaqSup"
    GCnConexion.Open GCnConexion.ConnectionString, "usr_taquillas", "Taquillas1234"


End If
Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GCnConClose()
On Error GoTo err1
   If GCnConexion.State <> 0 Then
      GCnConexion.Close
      Set GCnConexion = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub

Sub GRsResultadoclose()
On Error GoTo err1
   If GRsResultado.State <> 0 Then
      GRsResultado.Close
      Set GRsResultado = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GRsResultadoPclose()
On Error GoTo err1
   If GRsResultadoP.State <> 0 Then
      GRsResultadoP.Close
      Set GRsResultadoP = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GRsResultadoVclose()
On Error GoTo err1
   If GRsResultadoV.State <> 0 Then
      GRsResultadoV.Close
      Set GRsResultadoV = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GRsResultadoRclose()
On Error GoTo err1
   If GRsResultadoR.State <> 0 Then
      GRsResultadoR.Close
      Set GRsResultadoR = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GCnConBDResp()
On Error GoTo err1
   'Access  respaldos de la base de datos BD_RolTaqSup.accdb
If GCnConexionDResp.State = 0 Then
''   GCnConexionDResp.ConnectionString = "DSN=odbcroltaq;DBQ=" & GStrRutaR1 & "\BD_RolTaqSup.accdb" & ";DriverId=25;FIL=MS Access;MaxBufferSize=2048;PageTimeout=5;UID=admin;"
''   GCnConexionDResp.Open GCnConexionDResp.ConnectionString, "", ""
'    GCnConexionDResp.ConnectionString = "DSN=odbcroltaq;UID=taq_adm;PWD=taquilla;WSID=50.192.40.24;DATABASE=BD_RolTaqSup"
'    GCnConexionDResp.Open GCnConexionDResp.ConnectionString, "taq_adm", "taquilla"

     GCnConexionDResp.ConnectionString = "DSN=odbcroltaq;UID=usr_taquillas;PWD=Taquillas1234;WSID=50.192.41.212;DATABASE=BD_RolTaqSup"
     GCnConexionDResp.Open GCnConexionDResp.ConnectionString, "usr_taquillas", "Taquillas1234"


End If
Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GCnConCloseBDResp()
On Error GoTo err1
   If GCnConexionDResp.State <> 0 Then
      GCnConexionDResp.Close
      Set GCnConexionDResp = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GCnConBDRoles()
On Error GoTo err1
   'Access  respaldos de la base de datos BD_RolTaqSup.accdb
If GCnConexionBDRoles.State = 0 Then
''    GCnConexionBDRoles.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" & GStrRutaR1 & "\BD_RolTaqSup.accdb;Persist Security Info=True;Jet OLEDB:Database Password:"
''   GCnConexionBDRoles.Open GCnConexionBDRoles.ConnectionString, "", ""
'    GCnConexionBDRoles.ConnectionString = "DSN=odbcroltaq;UID=taq_adm;PWD=taquilla;WSID=50.192.40.24;DATABASE=BD_RolTaqSup"
'    GCnConexionBDRoles.Open GCnConexionBDRoles.ConnectionString, "taq_adm", "taquilla"

     GCnConexionBDRoles.ConnectionString = "DSN=odbcroltaq;UID=usr_taquillas;PWD=Taquillas1234;WSID=50.192.41.212;DATABASE=BD_RolTaqSup"
     GCnConexionBDRoles.Open GCnConexionBDRoles.ConnectionString, "usr_taquillas", "Taquillas1234"

End If
Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub GCnConCloseBDRoles()
On Error GoTo err1
   If GCnConexionBDRoles.State <> 0 Then
      GCnConexionBDRoles.Close
      Set GCnConexionBDRoles = Nothing
   End If
   Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume
End Sub
Sub Conexion_Reporte(nformulario As Form)
    nformulario.RptReportes.Reset
'    nformulario.RptReportes.Connect = "DSN=odbcRolTaquilla;DBQ=" & App.Path & "\BD_RolTaqSup.accdb" & ";DriverId=25;FIL=MS Access;MaxBufferSize=2048;PageTimeout=5;UID=admin;"
'    nformulario.RptReportes.Connect = "DSN=odbcroltaq;UID=taq_adm;PWD=taquilla;WSID=50.192.40.24;DATABASE=BD_RolTaqSup"

     nformulario.RptReportes.Connect = "DSN=odbcroltaq;UID=usr_taquillas;PWD=Taquillas1234;WSID=50.192.41.212;DATABASE=BD_RolTaqSup"

End Sub
'checa rol vigente, para ver si esta rolado
Sub Presenta_DatosDelRol_Vigente(nformulario As Form)
Dim rol As Integer
    Call GCnConClose
    Call GCnCon
                             
    GStrCadena = ""
    GStrCadena = "SELECT id_rol_anual, nombre_rol, meses_q_califica, fecha_ini, fecha_fin, estatus_roldescansos FROM rolvigente"
    GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
    If GRsResultado.EOF Then
       MsgBox "No existe el registro del rol vigente, Haga su asignación ... ", vbInformation, GStrMensaje
    Else

       GStrNo_NomRol = Trim(GRsResultado!nombre_rol)
       nformulario.StBar_RolenelAño.Panels(1).Text = Trim(GRsResultado!nombre_rol)
       nformulario.StBar_RolenelAño.Panels(2).Text = "VIGENCIA:"
       nformulario.StBar_RolenelAño.Panels(3).Text = FormatDateTime(GRsResultado!fecha_ini, vbLongDate)
       nformulario.StBar_RolenelAño.Panels(4).Text = FormatDateTime(GRsResultado!fecha_fin, vbLongDate)
       nformulario.StBar_RolenelAño.Panels(5).Text = Trim(GRsResultado!meses_q_califica)
       
       GStrNo_Rolvigente = GRsResultado!id_rol_anual
       GStrAño_Rolvigente = Year(GRsResultado!fecha_fin)
       'variable de estado para cambiar rol vigente
       GStrM_ROL_estado = GRsResultado!id_rol_anual
       GStrNo_Fcha_ini_Rol = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
       GStrNo_Fcha_fin_Rol = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
       
       
       If Not IsNull(GRsResultado!estatus_roldescansos) Then
          
          GStrEstRolDescansos = GRsResultado!estatus_roldescansos
          
          'para el respaldo
'''          If GStrEstRolDescansos = "ROLADO" Then
'''             nformulario.StBar_RolenelAño.Panels(5).Text = "ROLADO:"
'''          Else
'''             nformulario.StBar_RolenelAño.Panels(5).Text = Trim(GRsResultado!meses_q_califica)
''''             GStrEstRespalda_rol = ""
'''          End If
          
          'variables para cambiar la fecha del nuevo rol en los reportes, auque no se haya cambiado el nuevo rol como vigente
'          GStrNo_Rolvigente = GRsResultado!id_rol_anual
'          GStrAño_Rolvigente = Year(GRsResultado!fecha_ini)
'          'variable de estado para cambiar rol vigente
'          GStrM_ROL_estado = GRsResultado!id_rol_anual
'
'          GStrNo_Fcha_ini_Rol = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
'          GStrNo_Fcha_fin_Rol = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
          
          
'          GStrNumeroDeRol = GRsResultado!id_rol_anual
       Else
          GStrEstRolDescansos = ""     '??GRsResultado!estatus_roldescansos
       
'          'variables para cambiar la fecha del nuevo rol en los reportes, auque no se haya cambiado el nuevo rol como vigente
'          GStrNo_Rolvigente = GRsResultado!id_rol_anual
'          GStrAño_Rolvigente = Year(GRsResultado!fecha_ini)
'          'variable de estado para cambiar rol vigente
'          GStrM_ROL_estado = GRsResultado!id_rol_anual
'
'          GStrNo_Fcha_ini_Rol = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
'          GStrNo_Fcha_fin_Rol = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
     
       
'          GStrEstRolDescansos = ""
'          GStrEstRespalda_rol = ""
'          GStrNo_Fcha_ini_Rol = ""
'          GStrNo_Fcha_fin_Rol = ""
'          GStrNo_NomRol = ""
'          GStrNo_Rolvigente = 0
'          GStrAño_Rolvigente = 0
       End If
    End If
    
    
    Call GCnConClose
    
    
    'Rutina para cambiar la fecha del nuevo rol en los reportes,
    'checa rol vigente, SI YA FUE ROLADO TOMA LA FECHA DEL SIGUIENTE ROL
    'AUNQUE NO SE HAYA CAMBIADO EL NUEVO ROL COMO VIGENTE
    'TOMA DATOS DEL CATALOGO DE LOS ROLES DEL AÑO  cat_rolesdelaño
    'OJO
    '--------------------------------------------------------------------
    
    If GStrEstRolDescansos = "" Or GStrEstRolDescansos = " " Then
    Else
           Call GCnCon
           rol = 0
           Select Case GStrNo_Rolvigente
                   Case Is = "1"
                          rol = GStrNo_Rolvigente + 1
                     
                   Case Is = "2"
                          rol = GStrNo_Rolvigente + 1
                       Case Is = "3"
                          rol = GStrNo_Rolvigente + 1
                   Case Is = "4"
                   
                         ' CHECAR SI ESTA VARIABLE SE UTILIZA EN EL REPORTE
                         'para carga de registros del reporte rol con calificacion
                         ' GStrNo_RolTrabajo = 4
                   
                   
                          rol = 1
                         ' Verificar si esta bien quitar esta linea, porque se esta tomando fecha fin
                         ' y toma el siguiente año
                         
                         ' GStrAño_Rolvigente = GStrAño_Rolvigente + 1      ' "2023"  'se pone directo por pandemia
             End Select
                 
               ' se suspende para que tome rol 1 del 2022 xq no hicieron 3 roles en la pandemia
         
         GStrCadena = ""
         GStrCadena = "SELECT id_año, id_rol_anual, nombre_rol, meses_q_califica, fecha_ini, fecha_fin FROM cat_rolesdelaño " & _
                    " where id_rol_anual = " & rol & " and  id_año = '" & GStrAño_Rolvigente & "' "
                    '" where id_rol_anual = " & rol & " and  id_año = " & GStrAño_Rolvigente & " "
                    '  " where id_rol_anual = " & rol & " and  id_año = '" & GStrAño_Rolvigente2 & "' "
'                     " where id_rol_anual = " & rol & " and  id_año = '" & Year(GStrFechaHoy) & "' "
 

                      
         GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
        
         If GRsResultado.EOF Then
            MsgBox "No esta dado de alta el ROL Siguiente, Verifique ....", vbInformation, GStrMensaje
'            GStrEstRolDescansos = ""
         Else
            GStrNo_Rolvigente = rol
'            GStrNumeroDeRol = GRsResultado!id_rol_anual
            GStrNo_NomRol = Trim(GRsResultado!nombre_rol)
'            nformulario.StBar_RolenelAño.Panels(2).Text = "VIGENCIA:"
            GStrNo_Fcha_ini_Rol = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
            GStrNo_Fcha_fin_Rol = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
'            nformulario.StBar_RolenelAño.Panels(5).Text = Trim(GRsResultado!meses_q_califica)
            GStrM_Califica = Trim(GRsResultado!meses_q_califica)
         End If
         Call GCnConClose
    End If
        '   MsgBox "Se puso el Rol=1 y el Año=2022 directo, Antes de Generar siguente Rol pregunte a Sistemas....", vbInformation, GStrMensaje
    
End Sub

Sub Oculta_Menu_Principal()
    MDIFrmMenu.Catalogos.Visible = False
    MDIFrmMenu.calificaciones.Visible = False
    MDIFrmMenu.Procesos.Visible = False
    MDIFrmMenu.Reportes.Visible = False
    MDIFrmMenu.Consultas.Visible = False
    MDIFrmMenu.Vacaciones.Visible = False
    MDIFrmMenu.Utilerias.Visible = False
    MDIFrmMenu.A_Excel.Visible = False
    MDIFrmMenu.Salir_Del_Menu.Visible = False
End Sub

Sub Visualiza_Menu_Principal()
    MDIFrmMenu.Catalogos.Visible = True
    MDIFrmMenu.calificaciones.Visible = True
    MDIFrmMenu.Procesos.Visible = True
    MDIFrmMenu.Reportes.Visible = True
    MDIFrmMenu.Consultas.Visible = True
    MDIFrmMenu.Vacaciones.Visible = True
    MDIFrmMenu.Utilerias.Visible = True
    MDIFrmMenu.A_Excel.Visible = True
    MDIFrmMenu.Salir_Del_Menu.Visible = True
End Sub

Sub Prepara_Grid_Lineas(nformulario As Form)
On Error GoTo err1

'Grid de Lineas
    nformulario.GrdLineas.TextMatrix(0, 0) = "Lïnea"
    nformulario.GrdLineas.TextMatrix(0, 1) = "Direccion"
    nformulario.GrdLineas.TextMatrix(0, 2) = "Estación Inicial"
    nformulario.GrdLineas.TextMatrix(0, 3) = "Dirección"
    nformulario.GrdLineas.TextMatrix(0, 4) = "Estación Terminal"
    nformulario.GrdLineas.TextMatrix(0, 5) = "Estaciones"
    nformulario.GrdLineas.TextMatrix(0, 6) = "Taquillas"
    nformulario.GrdLineas.TextMatrix(0, 7) = "Tramos"
    nformulario.GrdLineas.TextMatrix(0, 8) = "Permcia"
    nformulario.GrdLineas.TextMatrix(0, 9) = "nombre"
    nformulario.GrdLineas.TextMatrix(0, 10) = "descripción"

    nformulario.GrdLineas.ColWidth(0) = 1000
    nformulario.GrdLineas.ColWidth(1) = 1000
    nformulario.GrdLineas.ColWidth(2) = 2000
    nformulario.GrdLineas.ColWidth(3) = 1000
    nformulario.GrdLineas.ColWidth(4) = 2000
    nformulario.GrdLineas.ColWidth(5) = 1100
    nformulario.GrdLineas.ColWidth(6) = 1100
    nformulario.GrdLineas.ColWidth(7) = 1100
    nformulario.GrdLineas.ColWidth(8) = 800
    nformulario.GrdLineas.ColWidth(9) = 1600
    nformulario.GrdLineas.ColWidth(10) = 2600
    
    nformulario.GrdLineas.ColAlignment(0) = 4
    nformulario.GrdLineas.ColAlignment(1) = 4
    nformulario.GrdLineas.ColAlignment(3) = 4
    nformulario.GrdLineas.ColAlignment(5) = 4
    nformulario.GrdLineas.ColAlignment(6) = 4
    nformulario.GrdLineas.ColAlignment(7) = 4
    nformulario.GrdLineas.ColAlignment(8) = 4

Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Lineas(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   
   nformulario.GrdLineas.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrCadena = ""
   GStrCadena = "SELECT l.id_linea, l.dirdelinea1, l.nombre_dirlin1, l.dirdelinea2, l.nombre_dirlin2, l.estaciones, " & _
                       "l.Taquillas, l.tramos, l.id_permanencia, p.nombre_perma, p.descripcion " & _
                " FROM cat_lineas l, cat_permanencias p " & _
                " WHERE l.id_permanencia = p.id_permanencia " & _
                " ORDER BY l.id_linea "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdLineas.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_linea)
            If Not IsNull(GRsResultado!dirdelinea1) Then
               nformulario.GrdLineas.TextMatrix(GIntR, 1) = Trim(GRsResultado!dirdelinea1)
            End If
            nformulario.GrdLineas.TextMatrix(GIntR, 2) = Trim(GRsResultado!nombre_dirlin1)
            If Not IsNull(GRsResultado!dirdelinea2) Then
               nformulario.GrdLineas.TextMatrix(GIntR, 3) = Trim(GRsResultado!dirdelinea2)
            End If
            nformulario.GrdLineas.TextMatrix(GIntR, 4) = Trim(GRsResultado!nombre_dirlin2)
            If Not IsNull(GRsResultado!Estaciones) Then
               nformulario.GrdLineas.TextMatrix(GIntR, 5) = Trim(GRsResultado!Estaciones)
            End If
            If Not IsNull(GRsResultado!Taquillas) Then
               nformulario.GrdLineas.TextMatrix(GIntR, 6) = Trim(GRsResultado!Taquillas)
            End If
            If Not IsNull(GRsResultado!tramos) Then
               nformulario.GrdLineas.TextMatrix(GIntR, 7) = Trim(GRsResultado!tramos)
            End If
            If Not IsNull(GRsResultado!id_permanencia) Then
               nformulario.GrdLineas.TextMatrix(GIntR, 8) = Trim(GRsResultado!id_permanencia)
            End If
            nformulario.GrdLineas.TextMatrix(GIntR, 9) = Trim(GRsResultado!nombre_perma)
            nformulario.GrdLineas.TextMatrix(GIntR, 10) = Trim(GRsResultado!descripcion)
            
            nformulario.GrdLineas.Rows = nformulario.GrdLineas.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdLineas.Row = nformulario.GrdLineas.Rows - 1
  '          nformulario.GrdLineas.TopRow = nformulario.GrdLineas.Row
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            GRsResultado.Close
            Call GCnConClose
            FrmCatLineas.GrdLineas.SetFocus
  Else
        MsgBox "El Catálogo de Líneas no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.TxtLinea.SetFocus
        nformulario.CmdConsulta.Visible = False
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

'Función para quitar el color de los objetos text, cuando se libera el control.
Public Function SCambiaColorInactivo(ByRef PoCaja As Object) As Boolean
    PoCaja.BackColor = GCFondoBlanco
End Function

'Función para asignar el color a los objetos text, cuando esten en uso.
Public Function SCambiaColorActivo(ByRef PoCaja As Object) As Boolean
    PoCaja.BackColor = GCFondoColor
End Function


Sub Prepara_Grid_Perma(nformulario As Form)
On Error GoTo err1

'Grid de Permanencias
    nformulario.GrdPerma.TextMatrix(0, 0) = "Permanencia"
    nformulario.GrdPerma.TextMatrix(0, 1) = "Nombre"
    nformulario.GrdPerma.TextMatrix(0, 2) = "Descripción"
    nformulario.GrdPerma.TextMatrix(0, 3) = "Siglas"

    nformulario.GrdPerma.ColWidth(0) = 1600
    nformulario.GrdPerma.ColWidth(1) = 1900
    nformulario.GrdPerma.ColWidth(2) = 3900
    nformulario.GrdPerma.ColWidth(3) = 1300
    
    nformulario.GrdPerma.ColAlignment(0) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

'Grid de Gaceta
Sub Prepara_Grid_Gta(nformulario As Form)
On Error GoTo err1


    nformulario.GrdGta.TextMatrix(0, 0) = "Expediente"
    nformulario.GrdGta.TextMatrix(0, 1) = "Permiso"
    nformulario.GrdGta.TextMatrix(0, 2) = "Fecha Inicio"

    nformulario.GrdGta.ColWidth(0) = 1600
    nformulario.GrdGta.ColWidth(1) = 1600
    nformulario.GrdGta.ColWidth(2) = 1600
    
    nformulario.GrdGta.ColAlignment(0) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub



Sub Consulta_Perma(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdPerma.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT * FROM cat_permanencias  ORDER BY id_permanencia "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_permanencia) Then
               nformulario.GrdPerma.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_permanencia)
            End If
            nformulario.GrdPerma.TextMatrix(GIntR, 1) = Trim(GRsResultado!nombre_perma)
            nformulario.GrdPerma.TextMatrix(GIntR, 2) = Trim(GRsResultado!descripcion)
            nformulario.GrdPerma.TextMatrix(GIntR, 3) = Trim(GRsResultado!siglas)

            nformulario.GrdPerma.Rows = nformulario.GrdPerma.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdPerma.Row = nformulario.GrdPerma.Rows - 1
'            nformulario.GrdPerma.TopRow = nformulario.GrdPerma.Row
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdPerma.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo de Permanencias no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtPerma.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

' Personal por Gaceta
Sub Consulta_Gta(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdGta.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT * FROM PersonalGaceta  ORDER BY Exp "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!exp) Then
               nformulario.GrdGta.TextMatrix(GIntR, 0) = Trim(GRsResultado!exp)
            End If
            nformulario.GrdGta.TextMatrix(GIntR, 1) = Trim(GRsResultado!permiso)
            nformulario.GrdGta.TextMatrix(GIntR, 2) = Format(GRsResultado!Fecha, "yyyy-mm-dd")

            nformulario.GrdGta.Rows = nformulario.GrdGta.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdGta.Row = nformulario.GrdGta.Rows - 1
'            nformulario.GrdPerma.TopRow = nformulario.GrdPerma.Row
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.TxtExp.SetFocus
            'nformulario.GrdGta.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo de Personal por Gaceta NO Tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtExp.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub


Sub Busca_Permanencia(nformulario As Form, permanencia)
   Call GCnCon
   Call GRsResultadoclose
   Dim LStrPermanencia As Integer
   LStrPermanencia = permanencia

   GStrCadena = ""
   GStrCadena = "SELECT id_permanencia, nombre_perma, descripcion FROM cat_permanencias WHERE Id_permanencia  = " & LStrPermanencia
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If GRsResultado.EOF Then
      GStrHay_Registro = "NO"
      nformulario.LblNombrePerma.Caption = ""
      nformulario.LblJefatura.capcion = ""
   Else
      GStrHay_Registro = "SI"
      nformulario.LblNombrePerma.Caption = GRsResultado!nombre_perma
      nformulario.LblJefatura.Caption = GRsResultado!descripcion
   End If

End Sub

Sub Prepara_Grid_Descansos(nformulario As Form)
On Error GoTo err1

'Grid de descansos
    nformulario.GrdDescansos.TextMatrix(0, 0) = "Descansos"
    nformulario.GrdDescansos.TextMatrix(0, 1) = "Iniciales"
    nformulario.GrdDescansos.TextMatrix(0, 2) = "Descanso 1"
    nformulario.GrdDescansos.TextMatrix(0, 3) = "Descanso 2"

    nformulario.GrdDescansos.ColWidth(0) = 1600
    nformulario.GrdDescansos.ColWidth(1) = 2200
    nformulario.GrdDescansos.ColWidth(2) = 2500
    nformulario.GrdDescansos.ColWidth(3) = 2500
    nformulario.GrdDescansos.ColAlignment(0) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Descansos(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdDescansos.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT * FROM cat_descansos  ORDER BY id_descansos "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdDescansos.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_descansos)
            nformulario.GrdDescansos.TextMatrix(GIntR, 1) = Trim(GRsResultado!iniciales)
            nformulario.GrdDescansos.TextMatrix(GIntR, 2) = Trim(GRsResultado!descanso1)
            nformulario.GrdDescansos.TextMatrix(GIntR, 3) = Trim(GRsResultado!descanso2)

            nformulario.GrdDescansos.Rows = nformulario.GrdDescansos.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdDescansos.Row = nformulario.GrdDescansos.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdDescansos.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo de Descansos no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtDescansos.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Estaciones(nformulario As Form)
On Error GoTo err1

'Grid de Estaciones
    nformulario.GrdEstaciones.TextMatrix(0, 0) = "Linea"
    nformulario.GrdEstaciones.TextMatrix(0, 1) = "Estación"
    nformulario.GrdEstaciones.TextMatrix(0, 2) = "Nombre de Estación"

    nformulario.GrdEstaciones.ColWidth(0) = 1600
    nformulario.GrdEstaciones.ColWidth(1) = 2200
    nformulario.GrdEstaciones.ColWidth(2) = 4420
    
    nformulario.GrdEstaciones.ColAlignment(0) = 4
    nformulario.GrdEstaciones.ColAlignment(1) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Estaciones(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdEstaciones.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = ""
   GStrCadena = "SELECT id_linea, id_estacion,  nombre_estacion FROM cat_estaciones " & _
                " order by id_linea asc, id_estacion asc "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdEstaciones.TextMatrix(GIntR, 0) = GRsResultado!id_linea
            nformulario.GrdEstaciones.TextMatrix(GIntR, 1) = GRsResultado!id_estacion
            nformulario.GrdEstaciones.TextMatrix(GIntR, 2) = Trim(GRsResultado!nombre_estacion)

            nformulario.GrdEstaciones.Rows = nformulario.GrdEstaciones.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdEstaciones.Row = nformulario.GrdEstaciones.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            If nformulario.GrdEstaciones.Row > 8 Then
               nformulario.GrdEstaciones.TopRow = nformulario.GrdEstaciones.Row - 7
            End If
            nformulario.GrdEstaciones.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo de Estaciones no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtLinea.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub TraeNombreDeNLinea(nformulario As Form, Nlinea As String)
On Error GoTo err1
   GStrHay_Registro = "NO"
   Call GCnCon

   GStrCadena = ""
   GStrCadena = "SELECT id_linea, nombre_dirlin1, nombre_dirlin2, estaciones FROM cat_lineas WHERE Id_linea = '" & Nlinea & "' "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If GRsResultado.EOF Then
      MsgBox "La linea '" & Nlinea & "'  no existe en el Catálogo de lineas. ", vbInformation, GStrMensaje
   Else
      GStrHay_Registro = "SI"
      GStrNombreDeLinea = Trim(GRsResultado!nombre_dirlin1) & "-" & Trim(GRsResultado!nombre_dirlin2)
   End If
   
   Call GRsResultado.Close
   Call GCnConClose 'Llamada al Procedimiento de cierre de conexión

Exit Sub
err1:
    MsgBox Err.Number & " " & Err.Description
    Resume

End Sub

Sub Prepara_Grid_Antiguedad_STC(nformulario As Form)
On Error GoTo err1

'Grid de Antiguedad en el STC
    nformulario.GrdParametros.TextMatrix(0, 0) = "Años Cumplidos"
    nformulario.GrdParametros.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametros.ColWidth(0) = 1950
    nformulario.GrdParametros.ColWidth(1) = 1250
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Antiguedad_STC(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdParametros.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT id_años_cumplidos, puntos_años_stc FROM pc_antiguedad_stc  ORDER BY id_años_cumplidos "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_años_cumplidos) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_años_cumplidos)
            End If
           If Not IsNull(GRsResultado!puntos_años_stc) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Format(GRsResultado!puntos_años_stc, "#0.0")
            End If
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdParametros.TopRow = nformulario.GrdParametros.Row - 2
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_antiguedad_stc no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtAños.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Puntualidad(nformulario As Form)
On Error GoTo err1

'Grid de Puntualidad en el STC
    nformulario.GrdParametros.TextMatrix(0, 0) = "Retardos"
    nformulario.GrdParametros.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametros.ColWidth(0) = 1100
    nformulario.GrdParametros.ColWidth(1) = 1400
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Puntualidad(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdParametros.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT id_retardos, puntos_retardos FROM pc_puntualidad  ORDER BY id_retardos "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_retardos) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_retardos)
            End If
           If Not IsNull(GRsResultado!puntos_retardos) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Format(GRsResultado!puntos_retardos, "#0.0")
            End If
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdParametros.TopRow = nformulario.GrdParametros.Row - 2
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_puntualidad no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtRetardos.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Asistencia(nformulario As Form)
On Error GoTo err1

'Grid de Asistencia en el STC
    nformulario.GrdParametros.TextMatrix(0, 0) = "Faltas"
    nformulario.GrdParametros.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametros.ColWidth(0) = 1050
    nformulario.GrdParametros.ColWidth(1) = 1400
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Asistencia(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdParametros.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT id_faltas, puntos_faltas FROM pc_asistencia  ORDER BY id_faltas "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_faltas) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_faltas)
            End If
           If Not IsNull(GRsResultado!puntos_faltas) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Format(GRsResultado!puntos_faltas, "#0.0")
            End If
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            If nformulario.GrdParametros.Row > 12 Then
               nformulario.GrdParametros.TopRow = nformulario.GrdParametros.Row - 2
            End If
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_asistencia no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtFaltas.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_RolesEnLinTur(nformulario As Form)
On Error GoTo err1

'Grid de Roles en la Línea
    nformulario.GrdParametros.TextMatrix(0, 0) = "Roles en la Línea"
    nformulario.GrdParametros.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametros.ColWidth(0) = 2000
    nformulario.GrdParametros.ColWidth(1) = 1250
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4

'Grid de Roles en el Turno
    nformulario.GrdParametrosT.TextMatrix(0, 0) = "Roles en el Turno"
    nformulario.GrdParametrosT.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametrosT.ColWidth(0) = 2000
    nformulario.GrdParametrosT.ColWidth(1) = 1250
    
    nformulario.GrdParametrosT.ColAlignment(0) = 4
    nformulario.GrdParametrosT.ColAlignment(1) = 4

Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_RolesEnLinTur(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdParametros.Rows = 2
   nformulario.GrdParametrosT.Rows = 2
   
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT id_roles_enlintur, puntos_roles_enlintur FROM pc_roles_enlintur  ORDER BY id_roles_enlintur "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_roles_enlintur) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_roles_enlintur)
               nformulario.GrdParametrosT.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_roles_enlintur)
            End If
           If Not IsNull(GRsResultado!puntos_roles_enlintur) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Format(GRsResultado!puntos_roles_enlintur, "#0.0")
               nformulario.GrdParametrosT.TextMatrix(GIntR, 1) = Format(GRsResultado!puntos_roles_enlintur, "#0.0")
            End If
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            nformulario.GrdParametrosT.Rows = nformulario.GrdParametrosT.Rows + 1
            
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            nformulario.GrdParametrosT.Row = nformulario.GrdParametrosT.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_roles_enlintur no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtRolesLinTur.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Sanciones(nformulario As Form)
On Error GoTo err1

'Grid de Sanciones
    nformulario.GrdParametros.TextMatrix(0, 0) = "Sanciones"
    nformulario.GrdParametros.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametros.ColWidth(0) = 1600
    nformulario.GrdParametros.ColWidth(1) = 1300
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Sanciones(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdParametros.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT id_sanciones, puntos_sanciones FROM pc_sanciones  ORDER BY id_sanciones "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_sanciones) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_sanciones)
            End If
           If Not IsNull(GRsResultado!puntos_sanciones) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Format(GRsResultado!puntos_sanciones, "#0.0")
            End If
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            If nformulario.GrdParametros.Row > 4 Then
               nformulario.GrdParametros.TopRow = nformulario.GrdParametros.Row - 2
            End If
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_sanciones no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtSanciones.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_FrecuenciaFE(nformulario As Form)
On Error GoTo err1

'Grid de Sanciones
    nformulario.GrdParametros.TextMatrix(0, 0) = "Frecuencia"
    nformulario.GrdParametros.TextMatrix(0, 1) = "Puntos"

    nformulario.GrdParametros.ColWidth(0) = 1600
    nformulario.GrdParametros.ColWidth(1) = 1350
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_FrecuenciaFE(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   GStrCadena = ""
   nformulario.GrdParametros.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = "SELECT id_frecuencia, puntos_frecuenciafe FROM pc_frecuencia_fe  ORDER BY id_frecuencia "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_frecuencia) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_frecuencia)
            End If
            If Not IsNull(GRsResultado!puntos_frecuenciafe) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Trim(GRsResultado!puntos_frecuenciafe)
            End If
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            If nformulario.GrdParametros.Row > 6 Then
               nformulario.GrdParametros.TopRow = nformulario.GrdParametros.Row - 2
            End If
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_frecuencia_fe no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtFrecuencia.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub


Sub Prepara_Grid_Faltante_de_Efectivo(nformulario As Form)
On Error GoTo err1

'Grid de Faltante de Efectivo
    nformulario.GrdParametros.TextMatrix(0, 0) = "Monto"
    nformulario.GrdParametros.TextMatrix(0, 1) = "De $"
    nformulario.GrdParametros.TextMatrix(0, 2) = "A $"
    nformulario.GrdParametros.TextMatrix(0, 3) = "Puntos     "

    nformulario.GrdParametros.ColWidth(0) = 1100
    nformulario.GrdParametros.ColWidth(1) = 1600
    nformulario.GrdParametros.ColWidth(2) = 1600
    nformulario.GrdParametros.ColWidth(3) = 1350
    
    nformulario.GrdParametros.ColAlignment(0) = 4
    nformulario.GrdParametros.ColAlignment(1) = 4
    nformulario.GrdParametros.ColAlignment(2) = 4
    nformulario.GrdParametros.ColAlignment(3) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Faltante_De_Efectivo(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdParametros.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrCadena = ""
   GStrCadena = "SELECT id_monto, demonto_inicial, amonto_final, puntos_xfaltaefectivo FROM pc_faltante_efectivo ORDER BY id_monto "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
      
            If Not IsNull(GRsResultado!id_monto) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_monto)
            End If
            If Not IsNull(GRsResultado!demonto_inicial) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 1) = Format(GRsResultado!demonto_inicial, "###,##0.00")
            End If
            If Not IsNull(GRsResultado!amonto_final) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 2) = Format(GRsResultado!amonto_final, "###,##0.00")
            End If
            If Not IsNull(GRsResultado!puntos_xfaltaefectivo) Then
               nformulario.GrdParametros.TextMatrix(GIntR, 3) = Trim(GRsResultado!puntos_xfaltaefectivo)
            End If
            
            nformulario.GrdParametros.Rows = nformulario.GrdParametros.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdParametros.Row = nformulario.GrdParametros.Rows - 1
            If nformulario.GrdParametros.Row > 5 Then
               nformulario.GrdParametros.TopRow = nformulario.GrdParametros.Row - 2
            End If
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdParametros.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo pc_faltante_efectivo no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtNumMonto.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_PersonalTaq(nformulario As Form)
On Error GoTo err1

'Grid de Personal de Taquilla
    nformulario.GrdPersonalTaq.TextMatrix(0, 0) = "Reg"
    nformulario.GrdPersonalTaq.TextMatrix(0, 1) = "Exp"
    nformulario.GrdPersonalTaq.TextMatrix(0, 2) = "Nombre"
    nformulario.GrdPersonalTaq.TextMatrix(0, 3) = "Fecha Ing"
    nformulario.GrdPersonalTaq.TextMatrix(0, 4) = "Jub"
    nformulario.GrdPersonalTaq.TextMatrix(0, 5) = "FoM"

    nformulario.GrdPersonalTaq.ColWidth(0) = 700
    nformulario.GrdPersonalTaq.ColWidth(1) = 1300
    nformulario.GrdPersonalTaq.ColWidth(2) = 5500
    nformulario.GrdPersonalTaq.ColWidth(3) = 1500
    nformulario.GrdPersonalTaq.ColWidth(4) = 550
    nformulario.GrdPersonalTaq.ColWidth(5) = 600
    
    nformulario.GrdPersonalTaq.ColAlignment(0) = 4
    nformulario.GrdPersonalTaq.ColAlignment(1) = 4
    nformulario.GrdPersonalTaq.ColAlignment(2) = 4
    nformulario.GrdPersonalTaq.ColAlignment(3) = 4
    nformulario.GrdPersonalTaq.ColAlignment(4) = 4
    nformulario.GrdPersonalTaq.ColAlignment(5) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub
'para lineas turnos por expediente
Sub Prepara_Grid_LinTur(nformulario As Form)
On Error GoTo err1

'Grid de Personal de Taquilla
    nformulario.GrdTramos.TextMatrix(0, 0) = "Reg"
    nformulario.GrdTramos.TextMatrix(0, 1) = "Exp"
    nformulario.GrdTramos.TextMatrix(0, 2) = "Nombre"
    nformulario.GrdTramos.TextMatrix(0, 3) = "Lin"
    nformulario.GrdTramos.TextMatrix(0, 4) = "Tur"
    nformulario.GrdTramos.TextMatrix(0, 5) = "Lin"
    nformulario.GrdTramos.TextMatrix(0, 6) = "Tur"
    nformulario.GrdTramos.TextMatrix(0, 7) = "Lin"
    nformulario.GrdTramos.TextMatrix(0, 8) = "Tur"
    nformulario.GrdTramos.TextMatrix(0, 9) = "Lin"
    nformulario.GrdTramos.TextMatrix(0, 10) = "Tur"
    nformulario.GrdTramos.TextMatrix(0, 11) = "Lineas"
    nformulario.GrdTramos.TextMatrix(0, 12) = "Turnos"
    
    nformulario.GrdTramos.ColWidth(0) = 850
    nformulario.GrdTramos.ColWidth(1) = 850
    nformulario.GrdTramos.ColWidth(2) = 3100
    nformulario.GrdTramos.ColWidth(3) = 650
    nformulario.GrdTramos.ColWidth(4) = 650
    nformulario.GrdTramos.ColWidth(5) = 650
    nformulario.GrdTramos.ColWidth(6) = 650
    nformulario.GrdTramos.ColWidth(7) = 650
    nformulario.GrdTramos.ColWidth(8) = 650
    nformulario.GrdTramos.ColWidth(9) = 650
    nformulario.GrdTramos.ColWidth(10) = 500
    nformulario.GrdTramos.ColWidth(11) = 850
    nformulario.GrdTramos.ColWidth(12) = 850
    
    nformulario.GrdTramos.ColAlignment(0) = 4
    nformulario.GrdTramos.ColAlignment(1) = 4
    nformulario.GrdTramos.ColAlignment(2) = 4
    nformulario.GrdTramos.ColAlignment(3) = 4
    nformulario.GrdTramos.ColAlignment(4) = 4
    nformulario.GrdTramos.ColAlignment(5) = 4
    nformulario.GrdTramos.ColAlignment(6) = 4
    nformulario.GrdTramos.ColAlignment(7) = 4
    nformulario.GrdTramos.ColAlignment(8) = 4
    nformulario.GrdTramos.ColAlignment(9) = 4
    nformulario.GrdTramos.ColAlignment(10) = 4
    nformulario.GrdTramos.ColAlignment(11) = 4
    nformulario.GrdTramos.ColAlignment(12) = 4
    
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_PersonalTaq(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdPersonalTaq.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrCadena = ""
   GStrCadena = "SELECT id_expediente, nombre, fecha_ingreso, prejubilacion,sexo FROM cat_personal_taquilla ORDER BY id_expediente "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdPersonalTaq.TextMatrix(GIntR, 0) = GIntR
            If Not IsNull(GRsResultado!id_expediente) Then
               nformulario.GrdPersonalTaq.TextMatrix(GIntR, 1) = Trim(GRsResultado!id_expediente)
            End If
            If Not IsNull(GRsResultado!nombre) Then
               nformulario.GrdPersonalTaq.TextMatrix(GIntR, 2) = Trim(GRsResultado!nombre)
            End If
            If Not IsNull(GRsResultado!fecha_ingreso) Then
               nformulario.GrdPersonalTaq.TextMatrix(GIntR, 3) = Format(GRsResultado!fecha_ingreso, "yyyy-mm-dd")
            End If
            If Not IsNull(GRsResultado!prejubilacion) Then
               nformulario.GrdPersonalTaq.TextMatrix(GIntR, 4) = Trim(GRsResultado!prejubilacion)
            End If
            If Not IsNull(GRsResultado!sexo) Then
               nformulario.GrdPersonalTaq.TextMatrix(GIntR, 5) = Trim(GRsResultado!sexo)
            End If
            
            
            nformulario.GrdPersonalTaq.Rows = nformulario.GrdPersonalTaq.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdPersonalTaq.Row = nformulario.GrdPersonalTaq.Rows - 1
            If nformulario.GrdPersonalTaq.Row > 9 Then
               nformulario.GrdPersonalTaq.TopRow = nformulario.GrdPersonalTaq.Row - 2
            End If
            nformulario.TxtTotReg.Text = Format(GIntR - 1, "#,##0")
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdPersonalTaq.SetFocus
            nformulario.GrdPersonalTaq.CellBackColor = GCFondoColorCel

            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo cat_personal_taquilla no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtExpediente.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub añoscumplidos()
''' Ejemplos para calccular
'' diferencia entre fechas en años
''DateDiff("yyyy", "01/01/2001", "01/01/2009")

' -- Agregar 90 días a la fecha "01/01/2009" -- Retorna 1 de Abril de 2009
'MsgBox DateAdd("d", 90, "01/01/2009")

End Sub


Sub Prepara_Grid_Catorcenas(nformulario As Form)
On Error GoTo err1

'Grid de Catorcenas
    nformulario.GrdCatorcenas.TextMatrix(0, 0) = "Año"
    nformulario.GrdCatorcenas.TextMatrix(0, 1) = "Ctcna"
    nformulario.GrdCatorcenas.TextMatrix(0, 2) = "Descrip"
    nformulario.GrdCatorcenas.TextMatrix(0, 3) = "Mes"
    
    nformulario.GrdCatorcenas.TextMatrix(0, 4) = "Del"
    nformulario.GrdCatorcenas.TextMatrix(0, 5) = "Al"
    nformulario.GrdCatorcenas.TextMatrix(0, 6) = "Período"
    
    nformulario.GrdCatorcenas.TextMatrix(0, 7) = "L"
    nformulario.GrdCatorcenas.TextMatrix(0, 8) = "M"
    nformulario.GrdCatorcenas.TextMatrix(0, 9) = "M"
    nformulario.GrdCatorcenas.TextMatrix(0, 10) = "J"
    nformulario.GrdCatorcenas.TextMatrix(0, 11) = "V"
    nformulario.GrdCatorcenas.TextMatrix(0, 12) = "S"
    nformulario.GrdCatorcenas.TextMatrix(0, 13) = "D"
     
    nformulario.GrdCatorcenas.TextMatrix(0, 14) = "L"
    nformulario.GrdCatorcenas.TextMatrix(0, 15) = "M"
    nformulario.GrdCatorcenas.TextMatrix(0, 16) = "M"
    nformulario.GrdCatorcenas.TextMatrix(0, 17) = "J"
    nformulario.GrdCatorcenas.TextMatrix(0, 18) = "V"
    nformulario.GrdCatorcenas.TextMatrix(0, 19) = "S"
    nformulario.GrdCatorcenas.TextMatrix(0, 20) = "D"
  

    nformulario.GrdCatorcenas.ColWidth(0) = 700
    nformulario.GrdCatorcenas.ColWidth(1) = 750
    nformulario.GrdCatorcenas.ColWidth(2) = 1050
    nformulario.GrdCatorcenas.ColWidth(3) = 1500
    nformulario.GrdCatorcenas.ColWidth(4) = 1600
    nformulario.GrdCatorcenas.ColWidth(5) = 1600
    nformulario.GrdCatorcenas.ColWidth(6) = 5600
    
    nformulario.GrdCatorcenas.ColWidth(7) = 400
    nformulario.GrdCatorcenas.ColWidth(8) = 400
    nformulario.GrdCatorcenas.ColWidth(9) = 400
    nformulario.GrdCatorcenas.ColWidth(10) = 400
    nformulario.GrdCatorcenas.ColWidth(11) = 400
    nformulario.GrdCatorcenas.ColWidth(12) = 400
    nformulario.GrdCatorcenas.ColWidth(13) = 400
    nformulario.GrdCatorcenas.ColWidth(14) = 400
    nformulario.GrdCatorcenas.ColWidth(15) = 400
    nformulario.GrdCatorcenas.ColWidth(16) = 400
    nformulario.GrdCatorcenas.ColWidth(17) = 400
    nformulario.GrdCatorcenas.ColWidth(18) = 400
    nformulario.GrdCatorcenas.ColWidth(19) = 400
    nformulario.GrdCatorcenas.ColWidth(20) = 400
    
    nformulario.GrdCatorcenas.ColAlignment(0) = 4
    nformulario.GrdCatorcenas.ColAlignment(1) = 4
    nformulario.GrdCatorcenas.ColAlignment(2) = 4
    nformulario.GrdCatorcenas.ColAlignment(4) = 1
    nformulario.GrdCatorcenas.ColAlignment(5) = 1
    nformulario.GrdCatorcenas.ColAlignment(7) = 4
    nformulario.GrdCatorcenas.ColAlignment(8) = 4
    nformulario.GrdCatorcenas.ColAlignment(9) = 4
    nformulario.GrdCatorcenas.ColAlignment(10) = 4
    nformulario.GrdCatorcenas.ColAlignment(11) = 4
    nformulario.GrdCatorcenas.ColAlignment(12) = 4
    nformulario.GrdCatorcenas.ColAlignment(13) = 4
    nformulario.GrdCatorcenas.ColAlignment(14) = 4
    nformulario.GrdCatorcenas.ColAlignment(15) = 4
    nformulario.GrdCatorcenas.ColAlignment(16) = 4
    nformulario.GrdCatorcenas.ColAlignment(17) = 4
    nformulario.GrdCatorcenas.ColAlignment(18) = 4
    nformulario.GrdCatorcenas.ColAlignment(19) = 4
    nformulario.GrdCatorcenas.ColAlignment(20) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Catorcenas(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdCatorcenas.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrCadena = ""
   GStrCadena = "SELECT id_año, id_catorcena, descrip123, mes, fecha_ini, fecha_fin, periodo, " & _
                "dia1, dia2, dia3, dia4, dia5, dia6, dia7, dia8, dia9, dia10, dia11, dia12, dia13, dia14 " & _
                  "FROM cat_catorcenas where id_año = '" & Year(GStrFechaHoy) & "'   ORDER BY id_año asc, id_catorcena asc "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_año) Then
               nformulario.GrdCatorcenas.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_año)
            End If
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 1) = Trim(GRsResultado!id_catorcena)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 2) = Trim(GRsResultado!descrip123)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 3) = Trim(GRsResultado!mes)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 4) = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 5) = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 6) = Trim(GRsResultado!periodo)
            
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 7) = Trim(GRsResultado!dia1)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 8) = Trim(GRsResultado!dia2)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 9) = Trim(GRsResultado!dia3)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 10) = Trim(GRsResultado!dia4)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 11) = Trim(GRsResultado!dia5)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 12) = Trim(GRsResultado!dia6)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 13) = Trim(GRsResultado!dia7)
            
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 14) = Trim(GRsResultado!dia8)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 15) = Trim(GRsResultado!dia9)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 16) = Trim(GRsResultado!dia10)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 17) = Trim(GRsResultado!dia11)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 18) = Trim(GRsResultado!dia12)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 19) = Trim(GRsResultado!dia13)
            nformulario.GrdCatorcenas.TextMatrix(GIntR, 20) = Trim(GRsResultado!dia14)
            
            nformulario.GrdCatorcenas.Rows = nformulario.GrdCatorcenas.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdCatorcenas.Row = nformulario.GrdCatorcenas.Rows - 1
            If nformulario.GrdCatorcenas.Row > 9 Then
               nformulario.GrdCatorcenas.TopRow = nformulario.GrdCatorcenas.Row - 2
            End If
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdCatorcenas.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo Catorcenas no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
'        nformulario.CmdConsulta.Visible = False
        nformulario.TxtAño.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Periodos_Vacacionales(nformulario As Form)
On Error GoTo err1

'Grid de Periodos vacacionales
    nformulario.GrdPerVac.TextMatrix(0, 0) = "Año"
    nformulario.GrdPerVac.TextMatrix(0, 1) = "Período"
    nformulario.GrdPerVac.TextMatrix(0, 2) = "Del"
    nformulario.GrdPerVac.TextMatrix(0, 3) = "Al"
    nformulario.GrdPerVac.TextMatrix(0, 4) = "Descripción Período"

    nformulario.GrdPerVac.ColWidth(0) = 800
    nformulario.GrdPerVac.ColWidth(1) = 950
    nformulario.GrdPerVac.ColWidth(2) = 1500
    nformulario.GrdPerVac.ColWidth(3) = 1500
    nformulario.GrdPerVac.ColWidth(4) = 6500
    
    nformulario.GrdPerVac.ColAlignment(0) = 4
    nformulario.GrdPerVac.ColAlignment(1) = 4
    nformulario.GrdPerVac.ColAlignment(2) = 4
    nformulario.GrdPerVac.ColAlignment(3) = 4
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Periodos_Vacacionales(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdPerVac.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrCadena = ""
   GStrCadena = "SELECT id_año, id_periodovac, fecha_ini, fecha_fin, periodo FROM cat_periodos_vacacionales where id_año = '" & nformulario.TxtAño.Text & "' ORDER BY id_año, id_periodovac "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_año) Then
               nformulario.GrdPerVac.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_año)
            End If

            If Not IsNull(GRsResultado!id_periodovac) Then
               nformulario.GrdPerVac.TextMatrix(GIntR, 1) = Trim(GRsResultado!id_periodovac)
            End If
            If Not IsNull(GRsResultado!fecha_ini) Then
               nformulario.GrdPerVac.TextMatrix(GIntR, 2) = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
            End If
            If Not IsNull(GRsResultado!fecha_fin) Then
               nformulario.GrdPerVac.TextMatrix(GIntR, 3) = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
            End If
            If Not IsNull(GRsResultado!periodo) Then
               nformulario.GrdPerVac.TextMatrix(GIntR, 4) = Trim(GRsResultado!periodo)
            End If

            
            nformulario.GrdPerVac.Rows = nformulario.GrdPerVac.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
'            nformulario.GrdPerVac.Row = nformulario.GrdPerVac.Rows - 1
'            If nformulario.GrdPerVac.Row > 10 Then
'               nformulario.GrdPerVac.TopRow = nformulario.GrdPerVac.Row - 2
'            End If
            
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdPerVac.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo cat_periodos_vacacionales no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        
'           nformulario.TxtAño.SetFocus
           nformulario.TxtPeriodoVac.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Roles_Del_Año(nformulario As Form)
On Error GoTo err1
'   se agrega Año  ' ATL05012017
'Grid de Roles del Año
    nformulario.GrdRolesDelAño.TextMatrix(0, 0) = "Año"
    nformulario.GrdRolesDelAño.TextMatrix(0, 1) = "Rol"
    nformulario.GrdRolesDelAño.TextMatrix(0, 2) = "Nombre"
    nformulario.GrdRolesDelAño.TextMatrix(0, 3) = "Meses que Califica"
    nformulario.GrdRolesDelAño.TextMatrix(0, 4) = "Del"
    nformulario.GrdRolesDelAño.TextMatrix(0, 5) = "Al"
    nformulario.GrdRolesDelAño.TextMatrix(0, 6) = "Estado"

    nformulario.GrdRolesDelAño.ColWidth(0) = 700
    nformulario.GrdRolesDelAño.ColWidth(1) = 600
    nformulario.GrdRolesDelAño.ColWidth(2) = 1600
    nformulario.GrdRolesDelAño.ColWidth(3) = 2100
    nformulario.GrdRolesDelAño.ColWidth(4) = 1550
    nformulario.GrdRolesDelAño.ColWidth(5) = 1550
    nformulario.GrdRolesDelAño.ColWidth(6) = 1000
    
    nformulario.GrdRolesDelAño.ColAlignment(0) = 4
    nformulario.GrdRolesDelAño.ColAlignment(1) = 4
    nformulario.GrdRolesDelAño.ColAlignment(3) = 4
    nformulario.GrdRolesDelAño.ColAlignment(4) = 4
    nformulario.GrdRolesDelAño.ColAlignment(5) = 4
    nformulario.GrdRolesDelAño.ColAlignment(6) = 4

Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Roles_Del_Año(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdRolesDelAño.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
      ' se agrega el id_año    ' ATL05012017
   GStrCadena = ""
   GStrCadena = "SELECT id_año, id_rol_anual, nombre_rol, meses_q_califica, fecha_ini, fecha_fin,estado FROM cat_rolesdelaño ORDER BY id_año, id_rol_anual "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            If Not IsNull(GRsResultado!id_año) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 0) = Trim(GRsResultado!id_año)
            End If
    
            If Not IsNull(GRsResultado!id_rol_anual) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 1) = Trim(GRsResultado!id_rol_anual)
            End If
            
            If Not IsNull(GRsResultado!nombre_rol) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 2) = Trim(GRsResultado!nombre_rol)
            End If
            
            If Not IsNull(GRsResultado!meses_q_califica) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 3) = Trim(GRsResultado!meses_q_califica)
            End If
            
            If Not IsNull(GRsResultado!fecha_ini) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 4) = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
            End If
            If Not IsNull(GRsResultado!fecha_fin) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 5) = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
            End If
            
            If Not IsNull(GRsResultado!estado) Then
               nformulario.GrdRolesDelAño.TextMatrix(GIntR, 6) = Trim(GRsResultado!estado)
            End If
            
            
            nformulario.GrdRolesDelAño.Rows = nformulario.GrdRolesDelAño.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdRolesDelAño.Row = nformulario.GrdRolesDelAño.Rows - 1
            
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdRolesDelAño.SetFocus
            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo cat_rolesdelaño no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtRol.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Taquillas(nformulario As Form)
On Error GoTo err1

'Grid de taquillas
    nformulario.GrdTaquillas.TextMatrix(0, 0) = "Taquilla"
    nformulario.GrdTaquillas.TextMatrix(0, 1) = "     Estación"
    nformulario.GrdTaquillas.TextMatrix(0, 2) = "Turno"
    nformulario.GrdTaquillas.TextMatrix(0, 3) = "DirLin"
    nformulario.GrdTaquillas.TextMatrix(0, 4) = "     Dirección"
    nformulario.GrdTaquillas.TextMatrix(0, 5) = "  Ext_Tel"

    nformulario.GrdTaquillas.ColWidth(0) = 1100
    nformulario.GrdTaquillas.ColWidth(1) = 2300
    nformulario.GrdTaquillas.ColWidth(2) = 900
    nformulario.GrdTaquillas.ColWidth(3) = 900
    nformulario.GrdTaquillas.ColWidth(4) = 3500
    nformulario.GrdTaquillas.ColWidth(5) = 1700
    
    nformulario.GrdTaquillas.ColAlignment(0) = 4
    nformulario.GrdTaquillas.ColAlignment(2) = 4
    nformulario.GrdTaquillas.ColAlignment(3) = 4
    nformulario.GrdTaquillas.ColAlignment(5) = 1
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Taquillas(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdTaquillas.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = ""
   GStrCadena = "SELECT t.id_taquilla, t.turno, t.dirdelinea, t.extension_tel, t.id_linea, t.id_estacion, l.nombre_dirlin1, l.nombre_dirlin2, e.nombre_estacion " & _
                 " FROM cat_taquillas t, cat_lineas l, cat_estaciones e " & _
                 "WHERE t.id_linea = l.id_linea AND " & _
                     "  t.id_linea = e.id_linea AND " & _
                     "  t.id_estacion = e.id_estacion" & _
                " ORDER BY t.id_taquilla ASC, t.turno ASC "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdTaquillas.TextMatrix(GIntR, 0) = GRsResultado!id_taquilla
            nformulario.GrdTaquillas.TextMatrix(GIntR, 1) = GRsResultado!nombre_estacion
            nformulario.GrdTaquillas.TextMatrix(GIntR, 2) = GRsResultado!turno
            nformulario.GrdTaquillas.TextMatrix(GIntR, 3) = GRsResultado!dirdelinea
            If GRsResultado!dirdelinea = 1 Then
               nformulario.GrdTaquillas.TextMatrix(GIntR, 4) = GRsResultado!nombre_dirlin1
            Else
               If GRsResultado!dirdelinea = 2 Then
                  nformulario.GrdTaquillas.TextMatrix(GIntR, 4) = GRsResultado!nombre_dirlin2
               Else
                  nformulario.GrdTaquillas.TextMatrix(GIntR, 4) = "SIN DIRECCION DE LINEA"
               End If
            End If
            
            If Not IsNull(GRsResultado!extension_tel) Then
               nformulario.GrdTaquillas.TextMatrix(GIntR, 5) = GRsResultado!extension_tel
            End If
            
            nformulario.GrdTaquillas.Rows = nformulario.GrdTaquillas.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdTaquillas.Row = nformulario.GrdTaquillas.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdTaquillas.TopRow = nformulario.GrdTaquillas.Row - 2
            nformulario.GrdTaquillas.SetFocus

            GRsResultado.Close
            Call GCnConClose
  Else
        MsgBox "El Catálogo de Taquillas no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtLinea.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Tramos(nformulario As Form)
On Error GoTo err1

'Grid de Tramos (GrdTramos)
    nformulario.GrdTramos.TextMatrix(0, 0) = "Reg"
    nformulario.GrdTramos.TextMatrix(0, 1) = "Número"
    nformulario.GrdTramos.TextMatrix(0, 2) = "Tramo"
    nformulario.GrdTramos.TextMatrix(0, 3) = "Taquilla"
    nformulario.GrdTramos.TextMatrix(0, 4) = "Turno"
    nformulario.GrdTramos.TextMatrix(0, 5) = "Categoria"
    nformulario.GrdTramos.TextMatrix(0, 6) = "Lugar"
    nformulario.GrdTramos.TextMatrix(0, 7) = "Descansos"
    nformulario.GrdTramos.TextMatrix(0, 8) = "Expediente"
    nformulario.GrdTramos.TextMatrix(0, 9) = "Permanencia"

    nformulario.GrdTramos.ColWidth(0) = 800
    nformulario.GrdTramos.ColWidth(1) = 1000
    nformulario.GrdTramos.ColWidth(2) = 800
    nformulario.GrdTramos.ColWidth(3) = 1100
    nformulario.GrdTramos.ColWidth(4) = 800
    nformulario.GrdTramos.ColWidth(5) = 1300
    nformulario.GrdTramos.ColWidth(6) = 800
    nformulario.GrdTramos.ColWidth(7) = 1300
    nformulario.GrdTramos.ColWidth(8) = 1400
    nformulario.GrdTramos.ColWidth(9) = 1500
    
    nformulario.GrdTramos.ColAlignment(0) = 4
    nformulario.GrdTramos.ColAlignment(1) = 4
    nformulario.GrdTramos.ColAlignment(2) = 4
    nformulario.GrdTramos.ColAlignment(3) = 4
    nformulario.GrdTramos.ColAlignment(4) = 4
    nformulario.GrdTramos.ColAlignment(5) = 4
    nformulario.GrdTramos.ColAlignment(6) = 4
    nformulario.GrdTramos.ColAlignment(7) = 4
    nformulario.GrdTramos.ColAlignment(8) = 4
    nformulario.GrdTramos.ColAlignment(9) = 4
    
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Tramos(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdTramos.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

   GStrCadena = ""
   GStrCadena = "SELECT numero, id_tramo, lugar, id_taquilla, turno, id_expediente, " & _
                       "categoria, id_descansos, id_permanencia " & _
                       "FROM rol_taquilla " & _
                       "ORDER BY id_tramo, id_taquilla, turno, categoria, lugar "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdTramos.TextMatrix(GIntR, 0) = GIntR
            If Not IsNull(GRsResultado!numero) Then
               nformulario.GrdTramos.TextMatrix(GIntR, 1) = Trim(GRsResultado!numero)
            End If
            nformulario.GrdTramos.TextMatrix(GIntR, 2) = GRsResultado!id_tramo
            nformulario.GrdTramos.TextMatrix(GIntR, 3) = GRsResultado!id_taquilla
            nformulario.GrdTramos.TextMatrix(GIntR, 4) = GRsResultado!turno
            nformulario.GrdTramos.TextMatrix(GIntR, 5) = GRsResultado!categoria
            nformulario.GrdTramos.TextMatrix(GIntR, 6) = GRsResultado!lugar
            nformulario.GrdTramos.TextMatrix(GIntR, 7) = GRsResultado!id_descansos
            nformulario.GrdTramos.TextMatrix(GIntR, 8) = GRsResultado!id_expediente
            nformulario.GrdTramos.TextMatrix(GIntR, 9) = GRsResultado!id_permanencia

            nformulario.GrdTramos.Rows = nformulario.GrdTramos.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdTramos.Row = nformulario.GrdTramos.Rows - 1
            nformulario.TxtTotReg.Text = Format(GIntR - 1, " #,##0")
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdTramos.TopRow = nformulario.GrdTramos.Row - 2
'            nformulario.GrdTramos.SetFocus

            GRsResultado.Close
            Call GCnConClose
   Else
        MsgBox "El Rol de Taquillas no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtTramo.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Prepara_Grid_Consulta_Tramos(nformulario As Form)
On Error GoTo err1

'Grid de consulta tramos sin exp (GrdConsultaTramos)
    nformulario.GrdConsultaTramos.TextMatrix(0, 0) = "Posicion"
    nformulario.GrdConsultaTramos.TextMatrix(0, 1) = "Tramo"
    nformulario.GrdConsultaTramos.TextMatrix(0, 2) = "Taquilla"
    nformulario.GrdConsultaTramos.TextMatrix(0, 3) = "Turno"
    nformulario.GrdConsultaTramos.TextMatrix(0, 4) = "Categoria"
    nformulario.GrdConsultaTramos.TextMatrix(0, 5) = "Lugar"
    nformulario.GrdConsultaTramos.TextMatrix(0, 6) = "Descansos"
    nformulario.GrdConsultaTramos.TextMatrix(0, 7) = "Expediente"
    nformulario.GrdConsultaTramos.TextMatrix(0, 8) = "Permanencia"

    nformulario.GrdConsultaTramos.ColWidth(0) = 1000
    nformulario.GrdConsultaTramos.ColWidth(1) = 800
    nformulario.GrdConsultaTramos.ColWidth(2) = 1100
    nformulario.GrdConsultaTramos.ColWidth(3) = 800
    nformulario.GrdConsultaTramos.ColWidth(4) = 1300
    nformulario.GrdConsultaTramos.ColWidth(5) = 800
    nformulario.GrdConsultaTramos.ColWidth(6) = 1300
    nformulario.GrdConsultaTramos.ColWidth(7) = 1400
    nformulario.GrdConsultaTramos.ColWidth(8) = 1500
    
    nformulario.GrdConsultaTramos.ColAlignment(0) = 4
    nformulario.GrdConsultaTramos.ColAlignment(1) = 4
    nformulario.GrdConsultaTramos.ColAlignment(2) = 4
    nformulario.GrdConsultaTramos.ColAlignment(3) = 4
    nformulario.GrdConsultaTramos.ColAlignment(4) = 4
    nformulario.GrdConsultaTramos.ColAlignment(5) = 4
    nformulario.GrdConsultaTramos.ColAlignment(6) = 4
    nformulario.GrdConsultaTramos.ColAlignment(7) = 4
    nformulario.GrdConsultaTramos.ColAlignment(8) = 4
    
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

'nuevo grid para agregar un registro (lugar)  en el rol de taquilla

Sub Prepara_Grid_agrega_lugares(nformulario As Form)
On Error GoTo err1

    nformulario.GrdTramos_agrega.TextMatrix(0, 0) = "Posicion"
    nformulario.GrdTramos_agrega.TextMatrix(0, 1) = "Tur"
    nformulario.GrdTramos_agrega.TextMatrix(0, 2) = "Expediente"
    nformulario.GrdTramos_agrega.TextMatrix(0, 3) = "Tramo"
    nformulario.GrdTramos_agrega.TextMatrix(0, 4) = "Ftas"
    nformulario.GrdTramos_agrega.TextMatrix(0, 5) = "Taquilla"
    nformulario.GrdTramos_agrega.TextMatrix(0, 6) = "Categoria"
    nformulario.GrdTramos_agrega.TextMatrix(0, 7) = "Descanso"
'    nformulario.GrdTramos_agrega.TextMatrix(0, 8) = ".."
    nformulario.GrdTramos_agrega.TextMatrix(0, 8) = "Lugar"
    nformulario.GrdTramos_agrega.TextMatrix(0, 9) = "CaliFicacion"
    nformulario.GrdTramos_agrega.TextMatrix(0, 10) = "Pem"
'    nformulario.GrdTramos_agrega.TextMatrix(0, 12) = "Nom Perm"
    nformulario.GrdTramos_agrega.TextMatrix(0, 11) = "Cambio"

    nformulario.GrdTramos_agrega.ColWidth(0) = 1000
    nformulario.GrdTramos_agrega.ColWidth(1) = 750
    nformulario.GrdTramos_agrega.ColWidth(2) = 1350
    nformulario.GrdTramos_agrega.ColWidth(3) = 1000
    nformulario.GrdTramos_agrega.ColWidth(4) = 750
    nformulario.GrdTramos_agrega.ColWidth(5) = 1000
    nformulario.GrdTramos_agrega.ColWidth(6) = 1000
    nformulario.GrdTramos_agrega.ColWidth(7) = 1000
'    nformulario.GrdTramos_agrega.ColWidth(8) = 400
    nformulario.GrdTramos_agrega.ColWidth(8) = 750
    nformulario.GrdTramos_agrega.ColWidth(9) = 1300
    nformulario.GrdTramos_agrega.ColWidth(10) = 500
'    nformulario.GrdTramos_agrega.ColWidth(12) = 1800
    nformulario.GrdTramos_agrega.ColWidth(11) = 1500
    
    nformulario.GrdTramos_agrega.ColAlignment(0) = 4
    nformulario.GrdTramos_agrega.ColAlignment(1) = 4
    nformulario.GrdTramos_agrega.ColAlignment(2) = 4
    nformulario.GrdTramos_agrega.ColAlignment(3) = 4
    nformulario.GrdTramos_agrega.ColAlignment(4) = 4
    nformulario.GrdTramos_agrega.ColAlignment(5) = 4
    nformulario.GrdTramos_agrega.ColAlignment(6) = 4
    nformulario.GrdTramos_agrega.ColAlignment(7) = 4
'    nformulario.GrdTramos_agrega.ColAlignment(8) = 4
    nformulario.GrdTramos_agrega.ColAlignment(8) = 4
    nformulario.GrdTramos_agrega.ColAlignment(9) = 4
    nformulario.GrdTramos_agrega.ColAlignment(10) = 4
'    nformulario.GrdTramos_agrega.ColAlignment(12) = 4
    nformulario.GrdTramos_agrega.ColAlignment(11) = 4
    
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

'nuevo
'nuevo
'para agregar registros en rol de taquilla
'Consulta_Datos

Sub agrega_lugar_enRol(nformulario As Form, turno As Integer, linea As String)
On Error GoTo err1
Dim maxexp As Double


'inicia la busqueda
   If GRsResultado.State = 1 Then GRsResultado.Close
   Call GCnCon
   
' Agrega un registro nuevo en el grid
      GStrCadena = ""
      GStrCadena = "SELECT max(numero) as maxexp FROM rol_taquilla"
      GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
             
      If (GRsResultado!maxexp) > 0 Then
          nformulario.TextNumero2 = Trim(GRsResultado!maxexp) + 1
      Else
          nformulario.TextNumero2 = 0
      End If
      
      Call GRsResultadoclose
     
'   --reporte lugares en tramo

   nformulario.GrdTramos_agrega.Rows = 2
'   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1

'   " where  substring(id_tramo,1,2) = '01' AND  rol_taquilla.turno in (1) " & _



   GStrCadena = ""
   GStrCadena = " SELECT rol_taquilla.numero, rol_taquilla.id_expediente,rol_taquilla.id_tramo,rol_taquilla.turno, " & _
   "rol_taquilla.faltas, rol_taquilla.id_taquilla, rol_taquilla.categoria,rol_taquilla.id_descansos, " & _
   "rol_taquilla.lugar , rol_taquilla.calificacion, rol_taquilla.id_permanencia " & _
   " FROM rol_taquilla rol_taquilla " & _
   " where substring(rol_taquilla.id_tramo,1,2) = '" & linea & "' AND rol_taquilla.turno in (" & turno & ") " & _
   " ORDER BY rol_taquilla.id_permanencia ASC, " & _
   " substring(rol_taquilla.id_tramo,5,1) ASC, " & _
   " substring(rol_taquilla.id_tramo,1,2) ASC, " & _
   " rol_taquilla.turno ASC, " & _
   " substring(rol_taquilla.id_tramo,3,2) ASC, " & _
   " rol_taquilla.lugar ASC, " & _
   " substring(rol_taquilla.id_descansos,2,1) ASC "
 




'   GStrCadena = ""
'   GStrCadena = " SELECT rol_taquilla.numero, rol_taquilla.id_expediente,rol_taquilla.id_tramo,rol_taquilla.turno, " & _
'   "cat_personal_taquilla.nombre,rol_taquilla.faltas, rol_taquilla.id_taquilla, " & _
'   "rol_taquilla.categoria,rol_taquilla.id_descansos,cat_descansos.iniciales," & _
'   "rol_taquilla.lugar , rol_taquilla.calificacion, rol_taquilla.id_permanencia, cat_permanencias.nombre_perma " & _
'   " FROM rol_taquilla rol_taquilla, cat_personal_taquilla cat_personal_taquilla,cat_descansos cat_descansos, cat_permanencias cat_permanencias" & _
'   " WHERE rol_taquilla.id_expediente = cat_personal_taquilla.id_expediente AND " & _
'   " rol_taquilla.id_descansos = cat_descansos.id_descansos AND " & _
'   " rol_taquilla.id_permanencia = cat_permanencias.id_permanencia AND  " & _
'   " substring(id_tramo,1,2) = '" & linea & "' AND " & _
'   " rol_taquilla.turno in (" & turno & ") " & _
'   " ORDER BY rol_taquilla.id_permanencia ASC, " & _
'   "substring(rol_taquilla.id_tramo,5,1) ASC, " & _
'   "substring(rol_taquilla.id_tramo,1,2) ASC, " & _
'   "rol_taquilla.turno ASC, " & _
'   "substring(rol_taquilla.id_tramo,3,2) ASC, " & _
'   "rol_taquilla.lugar ASC, " & _
'   "substring(rol_taquilla.id_descansos,2,1) ASC "


   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
    
      While Not GRsResultado.EOF
'            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 0) = GIntR
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 0) = Trim(GRsResultado!numero)
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 1) = GRsResultado!turno
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 2) = GRsResultado!id_expediente
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 3) = GRsResultado!id_tramo
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 4) = GRsResultado!faltas
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 5) = GRsResultado!id_taquilla
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 6) = GRsResultado!categoria
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 7) = GRsResultado!id_descansos
'            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 8) = GRsResultado!iniciales
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 8) = GRsResultado!lugar
            
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 9) = Format(IIf(IsNull(Trim(GRsResultado!calificacion)), " ", Trim(GRsResultado!calificacion)), "###,###,###,###,###.00")
            
'            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 9) = Format(GRsResultado!calificacion, " ###,###.##")
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 10) = GRsResultado!id_permanencia
'            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 12) = GRsResultado!nombre_perma
            
'            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 5) = GRsResultado!nombre
     
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 11) = "No"
     
     
            nformulario.GrdTramos_agrega.Rows = nformulario.GrdTramos_agrega.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
      
            'AGREGA UN NUEVO REGISTRO AL FINAL
            '----------------------------------------------------------------------
'            nformulario.GrdTramos_agrega.Rows = nformulario.GrdTramos_agrega.Rows + 1

            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 0) = FrmRolTaq_agrega.TextNumero2.Text
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 1) = turno
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 2) = 0
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 3) = FrmRolTaq_agrega.TxtTramo.Text
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 4) = 0
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 5) = FrmRolTaq_agrega.TxtTaquilla.Text
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 6) = FrmRolTaq_agrega.TxtCategoria.Text
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 7) = FrmRolTaq_agrega.TxtDescanso.Text
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 8) = 99
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 9) = 0
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 10) = FrmRolTaq_agrega.TextPermanencia.Text
            nformulario.GrdTramos_agrega.TextMatrix(GIntR, 11) = "No"
            '----------------------------------------------------------------------
      
'            nformulario.GrdTramos_agrega.Row = nformulario.GrdTramos_agrega.Rows - 1
            nformulario.TxtTotReg.Text = Format(GIntR - 1, " #,##0")
'            nformulario.CmdConsulta.Visible = False
'            nformulario.GrdTramos_agrega.TopRow = nformulario.GrdTramos_agrega.Row - 2
'            nformulario.GrdTramos.SetFocus

            GRsResultado.Close
            Call GCnConClose
   Else
        MsgBox "Verifique los parametros Seleccionados....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
'        nformulario.CmdConsulta.Visible = False
        nformulario.TxtExpediente.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub


Sub Carga_Combo_Descansos(nformulario As Form)
On Error GoTo err1
    Call GCnCon 'Llamada al Procedimiento de conexión
'    nformulario.CboDescansos.Clear
    
    GStrCadena = ""
    GStrCadena = "SELECT id_descansos FROM cat_descansos ORDER BY id_descansos"
    GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly

    If Not GRsResultado.EOF Then
       While Not GRsResultado.EOF
'             nformulario.CboDescansos.AddItem Trim(GRsResultado!id_descansos)
             GRsResultado.MoveNext
    Wend
       Call GRsResultadoclose
       Call GCnConClose
    Else
       Call GRsResultadoclose
       Call GCnConClose 'Llamada al Procedimiento de cierre de conexión
       MsgBox "No hay claves de días de descansos en el catálogo cat_descansos.... Registre los descansos ", vbInformation, GStrMensaje
    End If
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Carga_Combo_Lineas(nformulario As Form)
On Error GoTo err1
    Call GCnCon 'Llamada al Procedimiento de conexión
    nformulario.CboLineas.Clear
    
    GStrCadena = ""
    GStrCadena = "SELECT id_linea FROM cat_lineas ORDER BY id_linea"
    GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly

    If Not GRsResultado.EOF Then
       While Not GRsResultado.EOF
             nformulario.CboLineas.AddItem Trim(GRsResultado!id_linea)
             GRsResultado.MoveNext
    Wend
 '      NFormulario.CboLineas.Text = NFormulario.CboLineas.List(0)
       Call GRsResultadoclose
       Call GCnConClose
    Else
       Call GRsResultadoclose
       Call GCnConClose 'Llamada al Procedimiento de cierre de conexión
       MsgBox "No hay claves de Lineas en el catálogo cat_lineas.... Registre las Líneas ", vbInformation, GStrMensaje
    End If
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Tramos_Sin_Exp(nformulario As Form, ByVal Opcion As Integer, ByVal linea As String)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdConsultaTramos.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   GStrCadena = ""
   GStrNCampos = "SELECT NUMERO, rol_taquilla.id_tramo, rol_taquilla.lugar, rol_taquilla.id_taquilla, rol_taquilla.turno, " & _
                        "rol_taquilla.id_expediente, rol_taquilla.categoria, rol_taquilla.id_descansos, rol_taquilla.id_permanencia, " & _
                        "cat_permanencias.nombre_perma "
   GStrFrom = "FROM rol_taquilla, cat_permanencias "
   GStrOrderby = "ORDER BY NUMERO,rol_taquilla.id_permanencia, rol_taquilla.id_tramo, rol_taquilla.turno, rol_taquilla.lugar"
  
   GStrTituloReporte = " TRAMOS SIN EXPEDIENTE "
   GStrHay_SelecDatos = "NO"
   GStrNReporte = "RptTramosSinExp.rpt"
   
   If Opcion = 1 Then
          GStrWhere = " WHERE substring(id_tramo,1,2) = '" & linea & "' AND id_expediente = 0  AND " & _
                             " rol_taquilla.id_permanencia = cat_permanencias.id_permanencia "
   Else
          GStrWhere = " WHERE  id_expediente = 0 AND " & _
                             " rol_taquilla.id_permanencia = cat_permanencias.id_permanencia "
   End If
          
   GStrCadena = GStrNCampos & GStrFrom & GStrWhere & GStrOrderby
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
      GStrHay_SelecDatos = "SI"
      While Not GRsResultado.EOF
'            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 0) = GIntR
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 0) = GRsResultado!numero
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 1) = GRsResultado!id_tramo
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 2) = GRsResultado!id_taquilla
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 3) = GRsResultado!turno
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 4) = GRsResultado!categoria
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 5) = GRsResultado!lugar
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 6) = GRsResultado!id_descansos
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 7) = GRsResultado!id_expediente
            nformulario.GrdConsultaTramos.TextMatrix(GIntR, 8) = GRsResultado!id_permanencia

            nformulario.GrdConsultaTramos.Rows = nformulario.GrdConsultaTramos.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdConsultaTramos.Row = nformulario.GrdConsultaTramos.Rows - 1
            If nformulario.GrdConsultaTramos.Row > 3 Then
               nformulario.GrdConsultaTramos.TopRow = nformulario.GrdConsultaTramos.Row - 2
            End If
            nformulario.GrdConsultaTramos.SetFocus
            nformulario.GrdConsultaTramos.CellBackColor = GCFondoColorCel
            
            GRsResultado.Close
            Call GCnConClose
   Else
        MsgBox "No hay tramos sin expediente para la opción solicitada....", vbInformation, GStrMensaje
         GStrHay_SelecDatos = "NO"
        If Opcion = 1 Then
           nformulario.CboLineas.SetFocus
        End If
        
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Expedientes_Sin_Lugar(nformulario As Form, ByVal Opcion As Integer)
On Error GoTo err1
   Call GCnCon
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrNombreCampo = " id_expediente "
   GStrNCampos = "SELECT id_expediente, nombre, fecha_ingreso, prejubilacion, sexo  "
   GStrFrom = " FROM cat_personal_taquilla  "
   GStrWhere = " WHERE id_expediente NOT IN(SELECT id_expediente FROM rol_taquilla) "
   
   GStrTituloReporte = " EXPEDIENTES SIN LUGAR "
   GStrHay_SelecDatos = "NO"
   GStrNReporte = "RptExpSinLugar.rpt"
   
   GStrCadena = ""
 '           POR EXPEDIENTE
   If Opcion = 3 Then   '
      GStrOrderby = " ORDER BY id_expediente "
      GStrTitClasificacion = " Por Número de Expediente "
      
      GStrCadena = ""
      GStrCadena = GStrNCampos & GStrFrom & GStrWhere & GStrOrderby
     
   Else
      GStrOrderby = " ORDER BY nombre "
      GStrTitClasificacion = " Por Alfabético "
  
      GStrCadena = ""
      GStrCadena = GStrNCampos & GStrFrom & GStrWhere & GStrOrderby
      
   End If
                  
      GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
      If Not GRsResultado.EOF Then
         GStrHay_SelecDatos = "SI"

         While Not GRsResultado.EOF
               nformulario.GrdPersonalTaq.TextMatrix(GIntR, 0) = GIntR
               If Not IsNull(GRsResultado!id_expediente) Then
                  nformulario.GrdPersonalTaq.TextMatrix(GIntR, 1) = Trim(GRsResultado!id_expediente)
               End If
               If Not IsNull(GRsResultado!nombre) Then
                  nformulario.GrdPersonalTaq.TextMatrix(GIntR, 2) = Trim(GRsResultado!nombre)
               End If
               If Not IsNull(GRsResultado!fecha_ingreso) Then
                  nformulario.GrdPersonalTaq.TextMatrix(GIntR, 3) = Format(GRsResultado!fecha_ingreso, "yyyy-mm-dd")
               End If
               If Not IsNull(GRsResultado!prejubilacion) Then
                  nformulario.GrdPersonalTaq.TextMatrix(GIntR, 4) = Trim(GRsResultado!prejubilacion)
               End If
               If Not IsNull(GRsResultado!sexo) Then
                  nformulario.GrdPersonalTaq.TextMatrix(GIntR, 5) = Trim(GRsResultado!sexo)
               End If
               
               nformulario.GrdPersonalTaq.Rows = nformulario.GrdPersonalTaq.Rows + 1
               GIntR = GIntR + 1
               GRsResultado.MoveNext
         Wend
               nformulario.GrdPersonalTaq.Row = nformulario.GrdPersonalTaq.Rows - 1
               If nformulario.GrdPersonalTaq.Row > 9 Then
                  nformulario.GrdPersonalTaq.TopRow = nformulario.GrdPersonalTaq.Row - 2
               End If
               nformulario.GrdPersonalTaq.SetFocus
               nformulario.GrdPersonalTaq.CellBackColor = GCFondoColorCel
               GRsResultado.Close
               Call GCnConClose
      Else
          MsgBox "No hay expedientes sin lugar en el Rol ....", vbInformation, GStrMensaje
          GRsResultado.Close
          Call GCnConClose
      End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

'nueva Opcion
'tabla para guardar cambio de lugares antes y despues

Sub Consulta_Expedientes_Cambios(nformulario As Form, ByVal Opcion As Integer, fechasel As Date)
On Error GoTo err1
   Call GCnCon
   
   Dim fechahoy As String
   fechahoy = Format(fechasel, "yyyy-mm-dd")
   
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrNombreCampo = " "
   GStrNCampos = "SELECT numero , id_tramo, lugar, id_taquilla, turno, id_expediente, categoria, id_descansos, id_permanencia, faltas, calificacion, num_rol, anual, usuario, fecha_alta, Ncbio, AyD "
   GStrFrom = " From rol_taquilla_cbio_lugar "
   
'   fechahoy = Date
'   GStrWhere = " where fecha_alta = '" & fechahoy & "'"
   GStrWhere = " "
   
   GStrTituloReporte = " Cambios Realizados Antes y Despues de Cambio de Lugar "
   GStrHay_SelecDatos = "NO"
   GStrNReporte = "RptCbioLugar.rpt"
   
   GStrCadena = ""
      GStrOrderby = " order by Ncbio,AyD ,id_expediente"
      GStrTitClasificacion = "  "
      
      GStrCadena = ""
      GStrCadena = GStrNCampos & GStrFrom & GStrWhere & GStrOrderby
      GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
      
      If Not GRsResultado.EOF Then
         GStrHay_SelecDatos = "SI"
         GRsResultado.Close
         Call GCnConClose
      Else
          MsgBox "No Existen Datos de ese Dia Verifique....", vbInformation, GStrMensaje
          GRsResultado.Close
          Call GCnConClose
      End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub
Sub Prepara_Grid_Usuarios(nformulario As Form)
On Error GoTo err1

    nformulario.GrdUsuarios.TextMatrix(0, 0) = "Reg"
    nformulario.GrdUsuarios.TextMatrix(0, 1) = "Usuario"
    nformulario.GrdUsuarios.TextMatrix(0, 2) = "Password"
    nformulario.GrdUsuarios.TextMatrix(0, 3) = "Nombre"
    nformulario.GrdUsuarios.TextMatrix(0, 4) = "Edo"
    nformulario.GrdUsuarios.TextMatrix(0, 5) = "TipoUsr"
    nformulario.GrdUsuarios.TextMatrix(0, 6) = "Descripción"
'    nformulario.GrdUsuarios.TextMatrix(0, 7) = "Fecha Alta"
'    nformulario.GrdUsuarios.TextMatrix(0, 8) = "Fecha Baja"
 
   
    nformulario.GrdUsuarios.ColWidth(0) = 600
    nformulario.GrdUsuarios.ColWidth(1) = 900
    nformulario.GrdUsuarios.ColWidth(2) = 1500
    nformulario.GrdUsuarios.ColWidth(3) = 5100
    nformulario.GrdUsuarios.ColWidth(4) = 550
    nformulario.GrdUsuarios.ColWidth(5) = 600
    nformulario.GrdUsuarios.ColWidth(6) = 2500
'    nformulario.GrdUsuarios.ColWidth(7) = 1500
'    nformulario.GrdUsuarios.ColWidth(8) = 1500

    
'    nformulario.GrdUsuarios.ColAlignment(0) = 4
'    nformulario.GrdUsuarios.ColAlignment(1) = 4
'    nformulario.GrdUsuarios.ColAlignment(2) = 4
'    nformulario.GrdUsuarios.ColAlignment(3) = 4
'    nformulario.GrdUsuarios.ColAlignment(4) = 4
'    nformulario.GrdUsuarios.ColAlignment(5) = 4
'    nformulario.GrdUsuarios.ColAlignment(6) = 4
'    nformulario.GrdUsuarios.ColAlignment(7) = 4
'    nformulario.GrdUsuarios.ColAlignment(8) = 4
    
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Usuarios(nformulario As Form)
On Error GoTo err1
   Call GCnCon
   nformulario.GrdUsuarios.Rows = 2
   If GRsResultado.State = 1 Then GRsResultado.Close
   GIntR = 1
   
   GStrCadena = ""
   GStrCadena = "SELECT id_usuario, password, nombre, estatus, tipo_usuario, descri_usuario " & _
                       "FROM usuarios " & _
                       "ORDER BY id_usuario "
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
   
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdUsuarios.TextMatrix(GIntR, 0) = GIntR
            nformulario.GrdUsuarios.TextMatrix(GIntR, 1) = GRsResultado!id_usuario
            nformulario.GrdUsuarios.TextMatrix(GIntR, 2) = GRsResultado!Password
            nformulario.GrdUsuarios.TextMatrix(GIntR, 3) = GRsResultado!nombre
            nformulario.GrdUsuarios.TextMatrix(GIntR, 4) = GRsResultado!estatus
            nformulario.GrdUsuarios.TextMatrix(GIntR, 5) = GRsResultado!tipo_usuario
            nformulario.GrdUsuarios.TextMatrix(GIntR, 6) = GRsResultado!descri_usuario
'            nformulario.GrdUsuarios.TextMatrix(GIntR, 7) = Format(GRsResultado!fecha_alta, "yyyy-mm-dd")
'            nformulario.GrdUsuarios.TextMatrix(GIntR, 8) = Format(GRsResultado!fecha_baja, "yyyy-mm-dd")
            
            nformulario.GrdUsuarios.Rows = nformulario.GrdUsuarios.Rows + 1
            GIntR = GIntR + 1
            
            GRsResultado.MoveNext
      Wend
            nformulario.GrdUsuarios.Row = nformulario.GrdUsuarios.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdUsuarios.SetFocus

            GRsResultado.Close
            Call GCnConClose
   Else
        MsgBox "El Cátálogo de usuarios no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdConsulta.Visible = False
        nformulario.TxtUsuario.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
   
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub


Sub CuentaRegistros(nformulario As Form, LTabla As String)
On Error GoTo err1
    Call GCnCon
    If GRsResultado.State = 1 Then GRsResultado.Close
    
    GStrCadena = ""
    
       If LTabla = "programa_vacacional" Then
          GStrCadena = "SELECT count(*) as total_reg FROM " & LTabla & " where id_año = '" & nformulario.TxtAño.Text & "' "
       Else
    
        GStrCadena = "SELECT count(*) as total_reg FROM " & LTabla & ""
       End If
        GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
    
    
    If LTabla = "cat_personal_taquilla" Then   ' Solo para el catalogo del Personal de Taquilla por el expediente 0 = HUECO
       Dim LIntRegistros As Integer
       LIntRegistros = GRsResultado!total_reg
'       LIntRegistros = LIntRegistros - 1
       nformulario.TxtTotReg.Text = LIntRegistros
    Else
          nformulario.TxtTotReg.Text = Format(GRsResultado!total_reg, " #,##0")
    End If
    
    GRsResultado.Close
    Call GCnConClose
  
Exit Sub
err1:

MsgBox Err.Number & " " & Err.Description
Resume

End Sub

'para reporte de rol de taquilla
Sub CuentaRegistros_Rol(nformulario As Form, LTabla As String)
On Error GoTo err1
    Call GCnCon
    If GRsResultado.State = 1 Then GRsResultado.Close
    
    GStrCadena = ""

    GStrCadena = "SELECT count(*) as total_reg FROM " & LTabla & " where id_expediente > 0"
    GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
    
    If LTabla = "cat_personal_taquilla" Then   ' Solo para el catalogo del Personal de Taquilla por el expediente 0 = HUECO
       Dim LIntRegistros As Integer
       LIntRegistros = GRsResultado!total_reg
       LIntRegistros = LIntRegistros - 1
       nformulario.TxtTotReg.Text = LIntRegistros
    Else
       nformulario.TxtTotReg.Text = Format(GRsResultado!total_reg, " #,##0")
    End If
    
    GRsResultado.Close
    Call GCnConClose
  
Exit Sub
err1:

MsgBox Err.Number & " " & Err.Description
Resume

End Sub



Sub Prepara_Grid_ConsultaCalif(nformulario As Form)
On Error GoTo err1
     
    nformulario.GrdCalifica.TextMatrix(0, 0) = "Reg"
    nformulario.GrdCalifica.TextMatrix(0, 1) = "Exp"
    nformulario.GrdCalifica.TextMatrix(0, 2) = "Nombre"
    nformulario.GrdCalifica.TextMatrix(0, 3) = "Calif Tot"
    nformulario.GrdCalifica.TextMatrix(0, 4) = "IngresoSTC"
    nformulario.GrdCalifica.TextMatrix(0, 5) = "Años"
    nformulario.GrdCalifica.TextMatrix(0, 6) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 7) = "Faltas"
    nformulario.GrdCalifica.TextMatrix(0, 8) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 9) = "Retardos"
    nformulario.GrdCalifica.TextMatrix(0, 10) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 11) = "Falta Efec"
    nformulario.GrdCalifica.TextMatrix(0, 12) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 13) = "Frec"
    nformulario.GrdCalifica.TextMatrix(0, 14) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 15) = "Amonesta"
    nformulario.GrdCalifica.TextMatrix(0, 16) = "Notas"
    nformulario.GrdCalifica.TextMatrix(0, 17) = "Susp"
    nformulario.GrdCalifica.TextMatrix(0, 18) = "Sanción"
    nformulario.GrdCalifica.TextMatrix(0, 19) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 20) = "CalXMer"
    nformulario.GrdCalifica.TextMatrix(0, 21) = "RolesLin"
    nformulario.GrdCalifica.TextMatrix(0, 22) = "Calif"
    nformulario.GrdCalifica.TextMatrix(0, 23) = "RolesTur"
    nformulario.GrdCalifica.TextMatrix(0, 24) = "Calif"

    nformulario.GrdCalifica.ColWidth(0) = 800
    nformulario.GrdCalifica.ColWidth(1) = 1100
    nformulario.GrdCalifica.ColWidth(2) = 2500
    nformulario.GrdCalifica.ColWidth(3) = 1050
    nformulario.GrdCalifica.ColWidth(4) = 1600
    nformulario.GrdCalifica.ColWidth(5) = 750
    nformulario.GrdCalifica.ColWidth(6) = 750
    nformulario.GrdCalifica.ColWidth(7) = 750
    nformulario.GrdCalifica.ColWidth(8) = 750
    nformulario.GrdCalifica.ColWidth(9) = 1100
    nformulario.GrdCalifica.ColWidth(10) = 750
    nformulario.GrdCalifica.ColWidth(11) = 1250
    nformulario.GrdCalifica.ColWidth(12) = 750
    nformulario.GrdCalifica.ColWidth(13) = 750
    nformulario.GrdCalifica.ColWidth(14) = 750
    nformulario.GrdCalifica.ColWidth(15) = 1200
    nformulario.GrdCalifica.ColWidth(16) = 800
    nformulario.GrdCalifica.ColWidth(17) = 800
    nformulario.GrdCalifica.ColWidth(18) = 950
    nformulario.GrdCalifica.ColWidth(19) = 750
    nformulario.GrdCalifica.ColWidth(20) = 1050
    nformulario.GrdCalifica.ColWidth(21) = 1100
    nformulario.GrdCalifica.ColWidth(22) = 750
    nformulario.GrdCalifica.ColWidth(23) = 1100
    nformulario.GrdCalifica.ColWidth(24) = 750
    
    nformulario.GrdCalifica.ColAlignment(0) = 4
    nformulario.GrdCalifica.ColAlignment(1) = 4
    nformulario.GrdCalifica.ColAlignment(3) = 4
    nformulario.GrdCalifica.ColAlignment(4) = 4
    nformulario.GrdCalifica.ColAlignment(5) = 4
    nformulario.GrdCalifica.ColAlignment(6) = 7
    nformulario.GrdCalifica.ColAlignment(7) = 4
    nformulario.GrdCalifica.ColAlignment(8) = 7
    nformulario.GrdCalifica.ColAlignment(9) = 4
    nformulario.GrdCalifica.ColAlignment(10) = 7
    nformulario.GrdCalifica.ColAlignment(11) = 7
    nformulario.GrdCalifica.ColAlignment(12) = 4
    nformulario.GrdCalifica.ColAlignment(13) = 4
    nformulario.GrdCalifica.ColAlignment(14) = 4
    nformulario.GrdCalifica.ColAlignment(15) = 4
    nformulario.GrdCalifica.ColAlignment(16) = 4
    nformulario.GrdCalifica.ColAlignment(17) = 4
    nformulario.GrdCalifica.ColAlignment(18) = 4
    nformulario.GrdCalifica.ColAlignment(19) = 7
    nformulario.GrdCalifica.ColAlignment(20) = 7
    nformulario.GrdCalifica.ColAlignment(21) = 4
    nformulario.GrdCalifica.ColAlignment(22) = 7
    nformulario.GrdCalifica.ColAlignment(23) = 4
    nformulario.GrdCalifica.ColAlignment(24) = 7
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Calificaciones(nformulario As Form)
 On Error GoTo err1
      GIntR = 1
      Call GCnCon
      GStrCadena = ""
      GStrCadena = "SELECT c.id_expediente, c.id_faltas, c.id_retardos, c.id_roles_enturno, c.id_roles_enlinea, " & _
                          "c.amonestaciones, c.notas, c.suspensiones, c.monto_faltante_efec, c.id_frecuencia, " & _
                          "c.id_sanciones, c.id_años_cumplidos, c.cal_porantiguedad, c.cal_porfaltas, c.cal_porretardos, " & _
                          "c.cal_roles_enturno, c.cal_roles_enlinea, c.cal_pormerito, c.calificacion, c.cal_porsanciones, " & _
                          "c.cal_porfaltante_efec, c.cal_porfrecuencia_fefec, " & _
                          "p.nombre, p.fecha_ingreso " & _
                     "FROM calificacion_taq c, cat_personal_taquilla p WHERE c.id_expediente = p.id_expediente " & _
                     "ORDER BY P.nombre ASC "
      GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
         
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdCalifica.TextMatrix(GIntR, 0) = GIntR
            nformulario.GrdCalifica.TextMatrix(GIntR, 1) = GRsResultado!id_expediente
            nformulario.GrdCalifica.TextMatrix(GIntR, 2) = GRsResultado!nombre
            nformulario.GrdCalifica.TextMatrix(GIntR, 3) = Format(GRsResultado!calificacion, "##0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 4) = Format(GRsResultado!fecha_ingreso, "yyyy-mm-dd")
            nformulario.GrdCalifica.TextMatrix(GIntR, 5) = GRsResultado!id_años_cumplidos
            nformulario.GrdCalifica.TextMatrix(GIntR, 6) = Format(GRsResultado!cal_porantiguedad, "#0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 7) = GRsResultado!id_faltas
            nformulario.GrdCalifica.TextMatrix(GIntR, 8) = Format(GRsResultado!cal_porfaltas, "#0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 9) = GRsResultado!id_retardos
            nformulario.GrdCalifica.TextMatrix(GIntR, 10) = Format(GRsResultado!cal_porretardos, "#0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 11) = Format(GRsResultado!monto_faltante_efec, "###,##0.00")
            nformulario.GrdCalifica.TextMatrix(GIntR, 12) = Format(GRsResultado!cal_porfaltante_efec, "0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 13) = GRsResultado!id_frecuencia
            nformulario.GrdCalifica.TextMatrix(GIntR, 14) = Format(GRsResultado!cal_porfrecuencia_fefec, "0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 15) = GRsResultado!amonestaciones
            nformulario.GrdCalifica.TextMatrix(GIntR, 16) = GRsResultado!notas
            nformulario.GrdCalifica.TextMatrix(GIntR, 17) = GRsResultado!suspensiones
            nformulario.GrdCalifica.TextMatrix(GIntR, 18) = GRsResultado!id_sanciones
            nformulario.GrdCalifica.TextMatrix(GIntR, 19) = Format(GRsResultado!cal_porsanciones, "#0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 20) = Format(GRsResultado!cal_pormerito, "#0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 21) = GRsResultado!id_roles_enlinea
            nformulario.GrdCalifica.TextMatrix(GIntR, 22) = Format(GRsResultado!cal_roles_enlinea, "#0.0")
            nformulario.GrdCalifica.TextMatrix(GIntR, 23) = GRsResultado!id_roles_enturno
            nformulario.GrdCalifica.TextMatrix(GIntR, 24) = Format(GRsResultado!cal_roles_enturno, "#0.0")
            
            nformulario.GrdCalifica.Rows = nformulario.GrdCalifica.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdCalifica.Row = nformulario.GrdCalifica.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            GRsResultado.Close
            Call GCnConClose
   Else
        MsgBox "El archivo calificacion_taq no tiene registros, Verifique ....", vbInformation, GStrMensaje
        nformulario.TxtTotReg.Text = GIntR - 1
        nformulario.CmdSalir.SetFocus
        GRsResultado.Close
        Call GCnConClose
   End If
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume

End Sub

Sub Prepara_Grid_SolVacaciones(nformulario As Form)
On Error GoTo err1

'Grid de Solicitudes de Vacaciones
    nformulario.GrdSolVac.TextMatrix(0, 0) = "Exp"
    nformulario.GrdSolVac.TextMatrix(0, 1) = "Nombre"
    nformulario.GrdSolVac.TextMatrix(0, 2) = "Opc1"
    nformulario.GrdSolVac.TextMatrix(0, 3) = "Opc2"
    nformulario.GrdSolVac.TextMatrix(0, 4) = "Opc3"
    nformulario.GrdSolVac.TextMatrix(0, 5) = "Opc1"
    nformulario.GrdSolVac.TextMatrix(0, 6) = "Opc2"
    nformulario.GrdSolVac.TextMatrix(0, 7) = "Opc3"
    nformulario.GrdSolVac.TextMatrix(0, 8) = "Año"
  
    nformulario.GrdSolVac.ColWidth(0) = 900
    nformulario.GrdSolVac.ColWidth(1) = 3500
    nformulario.GrdSolVac.ColWidth(2) = 1000
    nformulario.GrdSolVac.ColWidth(3) = 1000
    nformulario.GrdSolVac.ColWidth(4) = 1000
    nformulario.GrdSolVac.ColWidth(5) = 1000
    nformulario.GrdSolVac.ColWidth(6) = 1000
    nformulario.GrdSolVac.ColWidth(7) = 1000
    nformulario.GrdSolVac.ColWidth(8) = 750
    
    nformulario.GrdSolVac.ColAlignment(0) = 4
    nformulario.GrdSolVac.ColAlignment(2) = 4
    nformulario.GrdSolVac.ColAlignment(3) = 4
    nformulario.GrdSolVac.ColAlignment(4) = 4
    nformulario.GrdSolVac.ColAlignment(5) = 4
    nformulario.GrdSolVac.ColAlignment(6) = 4
    nformulario.GrdSolVac.ColAlignment(7) = 4
    nformulario.GrdSolVac.ColAlignment(8) = 4
    
Exit Sub

err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub

Sub Consulta_Solicitudes_De_Vacaciones(nformulario As Form)
 On Error GoTo err1
 Dim años, año_act As Integer
 
 años = 0
 año_act = 0
 años = Year(Date)
 año_act = Year(Date)
 años = años + 1
 
 
      GIntR = 1
      Call GCnCon
      GStrCadena = ""
      GStrCadena = "SELECT s.id_expediente, s.opcion11, s.opcion12, s.opcion13, " & _
                          "s.opcion21, s.opcion22, s.opcion23, " & _
                          "p.nombre,año " & _
                     "FROM solvacaciones s, cat_personal_taquilla p " & _
                     "WHERE s.id_expediente = P.id_expediente " & _
                     " ORDER BY p.nombre ASC "
                        
'                    "WHERE s.id_expediente = P.id_expediente and año = " & años & "  " & _
'                    "ORDER BY p.nombre ASC "
      GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
         
   If Not GRsResultado.EOF Then
   
      While Not GRsResultado.EOF
            nformulario.GrdSolVac.TextMatrix(GIntR, 0) = GRsResultado!id_expediente
            nformulario.GrdSolVac.TextMatrix(GIntR, 1) = GRsResultado!nombre
            nformulario.GrdSolVac.TextMatrix(GIntR, 2) = Format(GRsResultado!opcion11, "00")
            nformulario.GrdSolVac.TextMatrix(GIntR, 3) = Format(GRsResultado!opcion12, "00")
            nformulario.GrdSolVac.TextMatrix(GIntR, 4) = Format(GRsResultado!opcion13, "00")
            nformulario.GrdSolVac.TextMatrix(GIntR, 5) = Format(GRsResultado!opcion21, "00")
            nformulario.GrdSolVac.TextMatrix(GIntR, 6) = Format(GRsResultado!opcion22, "00")
            nformulario.GrdSolVac.TextMatrix(GIntR, 7) = Format(GRsResultado!opcion23, "00")
            nformulario.GrdSolVac.TextMatrix(GIntR, 8) = GRsResultado!año
            
            nformulario.GrdSolVac.Rows = nformulario.GrdSolVac.Rows + 1
            GIntR = GIntR + 1
            GRsResultado.MoveNext
      Wend
            nformulario.GrdSolVac.Row = nformulario.GrdSolVac.Rows - 1
            nformulario.TxtTotReg.Text = GIntR - 1
            nformulario.CmdConsulta.Visible = False
            nformulario.GrdSolVac.SetFocus
            nformulario.GrdSolVac.CellBackColor = GCFondoColorCel
            GRsResultado.Close
            Call GCnConClose
   Else
   
'           MsgBox "No CORRESPONDE EL PERIODO DE VACACIONES, Verifique ....", vbInformation, GStrMensaje
           nformulario.TxtTotReg.Text = GIntR - 1
           nformulario.CmdConsulta.Visible = False
           nformulario.TxtExpediente.SetFocus
'           nformulario.CmdSalir.SetFocus
           
        GRsResultado.Close
        Call GCnConClose
   End If
Exit Sub
err1:
   MsgBox Err.Number & " " & Err.Description
   Resume
End Sub


'Declare Function SendMessageLong Lib "user32" Alias "SendMessageA" (ByVal hwnd As Long, ByVal wMsg As Long, ByVal wParam As Long, ByVal lParam As Long) As Long
'Exit Function
'End Function
