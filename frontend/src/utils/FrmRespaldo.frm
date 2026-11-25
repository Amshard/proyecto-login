VERSION 5.00
Object = "{5E9E78A0-531B-11CF-91F6-C2863C385E30}#1.0#0"; "MSFLXGRD.OCX"
Object = "{BDC217C8-ED16-11CD-956C-0000C04E4C0A}#1.1#0"; "TABCTL32.OCX"
Object = "{A8E5842E-102B-4289-9D57-3B3F5B5E15D3}#13.2#0"; "codejock.controls.v13.2.1.ocx"
Begin VB.Form FrmRespaldo 
   Caption         =   "Sistema de Control del personal de Taquilla"
   ClientHeight    =   10485
   ClientLeft      =   105
   ClientTop       =   435
   ClientWidth     =   14985
   ControlBox      =   0   'False
   BeginProperty Font 
      Name            =   "Verdana"
      Size            =   10.5
      Charset         =   0
      Weight          =   700
      Underline       =   0   'False
      Italic          =   0   'False
      Strikethrough   =   0   'False
   EndProperty
   LinkTopic       =   "Form1"
   MDIChild        =   -1  'True
   Picture         =   "FrmRespaldo.frx":0000
   ScaleHeight     =   10485
   ScaleWidth      =   14985
   WindowState     =   2  'Maximized
   Begin VB.CommandButton CmdBusc 
      BackColor       =   &H00C0E0FF&
      Caption         =   "Busca"
      BeginProperty Font 
         Name            =   "Verdana"
         Size            =   9
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   480
      Left            =   120
      MaskColor       =   &H00C0E0FF&
      Picture         =   "FrmRespaldo.frx":251D9
      TabIndex        =   11
      Top             =   3120
      Width           =   1215
   End
   Begin VB.CommandButton CmdGuardar 
      BackColor       =   &H00C0E0FF&
      Caption         =   "Grava Rol Vigente"
      BeginProperty Font 
         Name            =   "Verdana"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   705
      Left            =   120
      Style           =   1  'Graphical
      TabIndex        =   7
      Top             =   4680
      Width           =   1215
   End
   Begin VB.CommandButton CmdLimpiar 
      BackColor       =   &H00C0E0FF&
      Caption         =   "Limpia"
      BeginProperty Font 
         Name            =   "Verdana"
         Size            =   9
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   480
      Left            =   120
      MaskColor       =   &H00C0E0FF&
      Picture         =   "FrmRespaldo.frx":2561B
      TabIndex        =   6
      Top             =   2400
      Width           =   1215
   End
   Begin VB.TextBox TxtTotReg 
      Alignment       =   2  'Center
      BackColor       =   &H00E0E0E0&
      BeginProperty DataFormat 
         Type            =   1
         Format          =   "#,##0"
         HaveTrueFalseNull=   0
         FirstDayOfWeek  =   0
         FirstWeekOfYear =   0
         LCID            =   2058
         SubFormatType   =   1
      EndProperty
      BeginProperty Font 
         Name            =   "Verdana"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   13800
      TabIndex        =   5
      TabStop         =   0   'False
      Top             =   1200
      Width           =   735
   End
   Begin VB.CommandButton CmdSalir 
      BackColor       =   &H00C0E0FF&
      Caption         =   "Salir"
      BeginProperty Font 
         Name            =   "Verdana"
         Size            =   9
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   480
      Left            =   120
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   5880
      Width           =   1215
   End
   Begin TabDlg.SSTab TabRolesDelAño 
      Height          =   8295
      Left            =   1560
      TabIndex        =   0
      Top             =   1680
      Width           =   12975
      _ExtentX        =   22886
      _ExtentY        =   14631
      _Version        =   393216
      Tabs            =   1
      TabsPerRow      =   2
      TabHeight       =   529
      ForeColor       =   8388608
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "Verdana"
         Size            =   10.5
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      TabCaption(0)   =   "Respalda el Rol Vigente"
      TabPicture(0)   =   "FrmRespaldo.frx":25A5D
      Tab(0).ControlEnabled=   -1  'True
      Tab(0).Control(0)=   "LblAño"
      Tab(0).Control(0).Enabled=   0   'False
      Tab(0).Control(1)=   "Label1"
      Tab(0).Control(1).Enabled=   0   'False
      Tab(0).Control(2)=   "Label3"
      Tab(0).Control(2).Enabled=   0   'False
      Tab(0).Control(3)=   "Label4"
      Tab(0).Control(3).Enabled=   0   'False
      Tab(0).Control(4)=   "Label5"
      Tab(0).Control(4).Enabled=   0   'False
      Tab(0).Control(5)=   "Label6"
      Tab(0).Control(5).Enabled=   0   'False
      Tab(0).Control(6)=   "TxtAño"
      Tab(0).Control(6).Enabled=   0   'False
      Tab(0).Control(7)=   "FraRoles"
      Tab(0).Control(7).Enabled=   0   'False
      Tab(0).Control(8)=   "Text1"
      Tab(0).Control(8).Enabled=   0   'False
      Tab(0).Control(9)=   "Text2"
      Tab(0).Control(9).Enabled=   0   'False
      Tab(0).Control(10)=   "Text3"
      Tab(0).Control(10).Enabled=   0   'False
      Tab(0).Control(11)=   "Text4"
      Tab(0).Control(11).Enabled=   0   'False
      Tab(0).Control(12)=   "Text5"
      Tab(0).Control(12).Enabled=   0   'False
      Tab(0).Control(13)=   "Text6"
      Tab(0).Control(13).Enabled=   0   'False
      Tab(0).Control(14)=   "PBar"
      Tab(0).Control(14).Enabled=   0   'False
      Tab(0).Control(15)=   "Text7"
      Tab(0).Control(15).Enabled=   0   'False
      Tab(0).ControlCount=   16
      Begin VB.TextBox Text7 
         BackColor       =   &H8000000F&
         Enabled         =   0   'False
         Height          =   384
         Left            =   10320
         TabIndex        =   21
         Text            =   "estado"
         Top             =   2520
         Width           =   1455
      End
      Begin XtremeSuiteControls.ProgressBar PBar 
         Height          =   375
         Left            =   1080
         TabIndex        =   19
         Top             =   3480
         Width           =   10095
         _Version        =   851970
         _ExtentX        =   17806
         _ExtentY        =   661
         _StockProps     =   93
      End
      Begin VB.TextBox Text6 
         BackColor       =   &H8000000F&
         BeginProperty DataFormat 
            Type            =   1
            Format          =   "dd/MM/yyyy"
            HaveTrueFalseNull=   0
            FirstDayOfWeek  =   0
            FirstWeekOfYear =   0
            LCID            =   2058
            SubFormatType   =   3
         EndProperty
         Enabled         =   0   'False
         Height          =   384
         Left            =   6240
         TabIndex        =   18
         Text            =   "fec fin"
         Top             =   2520
         Width           =   1935
      End
      Begin VB.TextBox Text5 
         BackColor       =   &H8000000F&
         BeginProperty DataFormat 
            Type            =   1
            Format          =   "dd/MM/yyyy"
            HaveTrueFalseNull=   0
            FirstDayOfWeek  =   0
            FirstWeekOfYear =   0
            LCID            =   2058
            SubFormatType   =   3
         EndProperty
         Enabled         =   0   'False
         Height          =   384
         Left            =   4200
         TabIndex        =   17
         Text            =   "fec ini"
         Top             =   2520
         Width           =   1935
      End
      Begin VB.TextBox Text4 
         BackColor       =   &H8000000F&
         Enabled         =   0   'False
         Height          =   384
         Left            =   8280
         TabIndex        =   16
         Text            =   "inc"
         Top             =   2520
         Width           =   1935
      End
      Begin VB.TextBox Text3 
         BackColor       =   &H8000000F&
         Enabled         =   0   'False
         Height          =   384
         Left            =   2280
         TabIndex        =   15
         Text            =   "des rol"
         Top             =   2520
         Width           =   1815
      End
      Begin VB.TextBox Text2 
         BackColor       =   &H8000000F&
         BeginProperty DataFormat 
            Type            =   1
            Format          =   "0"
            HaveTrueFalseNull=   0
            FirstDayOfWeek  =   0
            FirstWeekOfYear =   0
            LCID            =   2058
            SubFormatType   =   1
         EndProperty
         Enabled         =   0   'False
         Height          =   384
         Left            =   1680
         TabIndex        =   14
         Text            =   "rol"
         Top             =   2520
         Width           =   495
      End
      Begin VB.TextBox Text1 
         BackColor       =   &H8000000F&
         BeginProperty DataFormat 
            Type            =   1
            Format          =   "0"
            HaveTrueFalseNull=   0
            FirstDayOfWeek  =   0
            FirstWeekOfYear =   0
            LCID            =   2058
            SubFormatType   =   1
         EndProperty
         Enabled         =   0   'False
         Height          =   384
         Left            =   840
         TabIndex        =   13
         Text            =   "año"
         Top             =   2520
         Width           =   735
      End
      Begin VB.Frame FraRoles 
         Caption         =   "-----------------------Roles Respaldados en el Historico"
         BeginProperty Font 
            Name            =   "Verdana"
            Size            =   10.5
            Charset         =   0
            Weight          =   700
            Underline       =   0   'False
            Italic          =   -1  'True
            Strikethrough   =   0   'False
         EndProperty
         ForeColor       =   &H00000000&
         Height          =   3495
         Left            =   1080
         TabIndex        =   3
         Top             =   4200
         Width           =   10095
         Begin MSFlexGridLib.MSFlexGrid GrdRolesDelAño 
            Height          =   2700
            Left            =   600
            TabIndex        =   20
            Top             =   480
            Width           =   8895
            _ExtentX        =   15690
            _ExtentY        =   4763
            _Version        =   393216
            Rows            =   6
            Cols            =   7
            FixedCols       =   2
            BackColor       =   16777215
            BackColorFixed  =   12640511
            BackColorBkg    =   14737632
            Enabled         =   -1  'True
            BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
               Name            =   "Verdana"
               Size            =   10.5
               Charset         =   0
               Weight          =   400
               Underline       =   0   'False
               Italic          =   0   'False
               Strikethrough   =   0   'False
            EndProperty
         End
      End
      Begin VB.TextBox TxtAño 
         BackColor       =   &H00FFFFFF&
         BeginProperty Font 
            Name            =   "Verdana"
            Size            =   9
            Charset         =   0
            Weight          =   700
            Underline       =   0   'False
            Italic          =   -1  'True
            Strikethrough   =   0   'False
         EndProperty
         Height          =   360
         Left            =   840
         TabIndex        =   2
         Top             =   1320
         Visible         =   0   'False
         Width           =   732
      End
      Begin VB.Label Label6 
         AutoSize        =   -1  'True
         Caption         =   "Estado"
         ForeColor       =   &H00800000&
         Height          =   255
         Left            =   10320
         TabIndex        =   25
         Top             =   2040
         Width           =   795
      End
      Begin VB.Label Label5 
         AutoSize        =   -1  'True
         Caption         =   "Meses Califica"
         ForeColor       =   &H00800000&
         Height          =   255
         Left            =   8280
         TabIndex        =   24
         Top             =   2040
         Width           =   1605
      End
      Begin VB.Label Label4 
         AutoSize        =   -1  'True
         Caption         =   "Fecha Final"
         ForeColor       =   &H00800000&
         Height          =   255
         Left            =   6240
         TabIndex        =   23
         Top             =   2040
         Width           =   1290
      End
      Begin VB.Label Label3 
         AutoSize        =   -1  'True
         Caption         =   "Fecha Inicial"
         ForeColor       =   &H00800000&
         Height          =   255
         Left            =   4200
         TabIndex        =   22
         Top             =   2040
         Width           =   1455
      End
      Begin VB.Label Label1 
         AutoSize        =   -1  'True
         Caption         =   "Proporciona el Año"
         ForeColor       =   &H00800000&
         Height          =   255
         Left            =   240
         TabIndex        =   12
         Top             =   840
         Visible         =   0   'False
         Width           =   2235
      End
      Begin VB.Label LblAño 
         AutoSize        =   -1  'True
         Caption         =   "Rol Vigente "
         ForeColor       =   &H00800000&
         Height          =   255
         Left            =   840
         TabIndex        =   4
         Top             =   2040
         Width           =   1410
      End
   End
   Begin VB.Label LblOfnaComp 
      AutoSize        =   -1  'True
      BackStyle       =   0  'Transparent
      Caption         =   "SUBDIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS"
      BeginProperty Font 
         Name            =   "Arial Black"
         Size            =   9
         Charset         =   0
         Weight          =   900
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000040C0&
      Height          =   270
      Left            =   5280
      TabIndex        =   10
      Top             =   720
      Width           =   6195
   End
   Begin VB.Label LblRegistros 
      AutoSize        =   -1  'True
      BackStyle       =   0  'Transparent
      Caption         =   "Registros"
      BeginProperty Font 
         Name            =   "Verdana"
         Size            =   9
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   210
      Left            =   12600
      TabIndex        =   9
      Top             =   1275
      Width           =   930
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      BackStyle       =   0  'Transparent
      Caption         =   "COORDINACIÓN DE TAQUILLA"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   12
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000040C0&
      Height          =   285
      Left            =   6240
      TabIndex        =   8
      Top             =   360
      Width           =   3630
   End
End
Attribute VB_Name = "FrmRespaldo"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
    'Programador:  Francisco Javier Garcia Zarate
Dim LBlnInsertar As Boolean, LStrCadenaV As String  'cadena variable para armar el select
Dim LintI As Integer, LStrUltimaFecha As Date, LStrNombreRol As String
Dim strAño As Integer


Private Sub CmdBusc_Click()
On Error GoTo err1
Dim con As String

LintI = 1

    Text1.Text = ""
    Text2.Text = ""
    Text3.Text = ""
    Text4.Text = ""
    Text5.Text = ""
    Text6.Text = ""
    Text7.Text = ""

 Me.TxtAño.Text = Year(GStrFechaHoy)


If Me.TxtAño.Text = "" Then
'   Me.TxtAño.SetFocus
   Exit Sub
End If
         
If Me.TxtAño.Text = Trim(Year(GStrFechaHoy)) Then
Else
   MsgBox "El Año debe ser el año de proceso"
'   Me.TxtAño.SetFocus
   Exit Sub
End If
         
         
   Call GCnCon
   GStrCadena = ""
   GStrCadena = " select rol_año,rol_num,inc_cargadas,fec_ini_rol,fec_fin_rol,fecha_respaldo,count(*) conta  from calif_roles_hist " & _
                " group by rol_año,rol_num,inc_cargadas,fec_ini_rol,fec_fin_rol,fecha_respaldo order by rol_año desc,rol_num"
   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly

   If GRsResultado.EOF Then
         MsgBox "No Existen Registros "
         Call GRsResultadoclose
         Call GCnConClose
'         Me.TxtAño.SetFocus
         Exit Sub
   Else
   
'       strAño = GRsResultado!rol_año
       CmdLimpiar_Click
       LintI = 1
       While Not GRsResultado.EOF
                'Vaciado de informacion en el GrdRolesdelaño
            Me.GrdRolesDelAño.TextMatrix(LintI, 0) = IIf(IsNull(GRsResultado!rol_año), "", Trim(GRsResultado!rol_año))
            Me.GrdRolesDelAño.TextMatrix(LintI, 1) = IIf(IsNull(GRsResultado!rol_num), "", Trim(GRsResultado!rol_num))
            Me.GrdRolesDelAño.TextMatrix(LintI, 2) = IIf(IsNull(GRsResultado!inc_cargadas), "", Trim(GRsResultado!inc_cargadas))
            Me.GrdRolesDelAño.TextMatrix(LintI, 3) = IIf(IsNull(GRsResultado!fec_ini_rol), "", Format(GRsResultado!fec_ini_rol, "yyyy-mm-dd"))
            Me.GrdRolesDelAño.TextMatrix(LintI, 4) = IIf(IsNull(GRsResultado!fec_fin_rol), "", Format(GRsResultado!fec_fin_rol, "yyyy-mm-dd"))
            Me.GrdRolesDelAño.TextMatrix(LintI, 5) = IIf(IsNull(GRsResultado!fecha_respaldo), "", Format(GRsResultado!fecha_respaldo, "yyyy-mm-dd"))
            Me.GrdRolesDelAño.TextMatrix(LintI, 6) = IIf(IsNull(GRsResultado!conta), "", GRsResultado!conta)
    
            LintI = LintI + 1
            GrdRolesDelAño.Rows = GrdRolesDelAño.Rows + 1
            GRsResultado.MoveNext
      Wend
             
             Call GRsResultadoclose
             Call GCnConClose


             Call GCnCon
             GStrCadena = ""
             GStrCadena = "Select  id_rol_anual,nombre_rol,meses_q_califica,fecha_ini,fecha_fin, estatus_roldescansos from rolvigente"
             GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
             If Not GRsResultado.EOF Then
'                Text1.Text = strAño
                Text1.Text = Trim(Year(GRsResultado!fecha_fin))
                Text2.Text = Trim(GRsResultado!id_rol_anual)
                Text3.Text = Trim(GRsResultado!nombre_rol)
                Text4.Text = Trim(GRsResultado!meses_q_califica)
                Text5.Text = Format(GRsResultado!fecha_ini, "yyyy-mm-dd")
                Text6.Text = Format(GRsResultado!fecha_fin, "yyyy-mm-dd")
                If Not IsNull(GRsResultado!estatus_roldescansos) Then
                   Text7.Text = Trim(GRsResultado!estatus_roldescansos)
                   
                   If Text7.Text = "ROLADO" Then
                   Else
                      Text7.Text = "NO Rolado"
                   End If
                Else
                   Text7.Text = "NO Rolado"
                End If
                
             End If


             'para maximo de registros
             Call GRsResultadoclose
             GStrCadena = ""
             GStrCadena = "SELECT count(*) FROM calif_roles_hist " & _
                          " WHERE rol_año = " & Me.Text1.Text & "  and rol_num =  " & Me.Text2.Text & ""
                          
'             GStrCadena = "SELECT count(*) FROM rol_taquilla WHERE id_expediente > 0 "
                          
                          
             GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly
             If GRsResultado(0) <> 0 Then
                'con = GRsResultado
                TxtTotReg = GRsResultado(0)
             Else
                TxtTotReg = 0
             End If


            Call GRsResultadoclose
            Call GCnConClose
'            Me.GrdRolesDelAño.SetFocus
    End If
Exit Sub
err1:
MsgBox Err.Number & " " & Err.Description
Resume
End Sub
Function Validaciones() As Boolean
On Error GoTo err1

    Validaciones = True
    
    'rol vigente
    Me.TxtAño.Text = Text1.Text
    
    If Trim(TxtAño.Text) = "" Then
        Validaciones = False
        MsgBox "Falta Seleccionar Año del Rol ....  Verifique ", vbInformation, GStrMensaje
'        Me.TxtAño.SetFocus
        Exit Function
    End If
    
   
   
   ''verifica si ya existe el respaldo
   ''------------------------------------
   
                ' SI EL ROL YA FUE ROLADO SEECCIONA EL SIGUIENTE; ESTAS VARIABLES LAS ENCONTRADAS EN  MODFUNCIONES
                ' ejemplo si rol vigente  = 1 y ya fue rolado se salva el rol siguiente  no  2
                ' En caso de regresar la informacion queda en estatus sin rolar y salvara el ROL Vigente
                
                If GStrEstRolDescansos = "" Or GStrEstRolDescansos = " " Then
                Else
                        Text1.Text = GStrAño_Rolvigente
                        Text2.Text = GStrNo_Rolvigente
                        Text3.Text = GStrNo_NomRol
                        Text4.Text = GStrM_Califica
                        Text5.Text = Format(GStrNo_Fcha_ini_Rol, "yyyy-mm-dd")
                        Text6.Text = Format(GStrNo_Fcha_fin_Rol, "yyyy-mm-dd")
                        Text7.Text = "ROLADO"
                        Text1.Text = Year(GStrNo_Fcha_ini_Rol)
                End If

   
   Call GCnCon
   GStrCadena = ""
   GStrCadena = "SELECT rol_año,rol_num FROM calif_roles_hist " & _
                " WHERE rol_año = " & Text1.Text & "  and  rol_num =  " & Text2.Text & " "

   GRsResultado.Open GStrCadena, GCnConexion, adOpenForwardOnly, adLockReadOnly

   If GRsResultado.EOF Then
            Call GRsResultadoclose
            Call GCnConClose
   Else
            If MsgBox("El Rol Ya Fue Gravado Desea Remplazarlo ? ", vbQuestion + vbYesNo, GStrMensaje) = vbYes Then
                   Call GRsResultadoclose
                   Call GCnConClose
                   Call Borra_Rol_respaldado  'Elimina Rol a Respaldar
            Else
                  MsgBox "Proceso Cancelado... ", vbInformation, GStrMensaje
                  Call GRsResultadoclose
                  Call GCnConClose
                  TxtAño.Text = ""            'Para eliminar el respaldo
                  CmdLimpiar_Click
            End If
   End If
    
Exit Function
err1:
MsgBox Err.Number & " " & Err.Description
Resume
End Function

'respalda rol vigente

Private Sub CmdGuardar_Click()
On Error GoTo err1
Dim LIntInd As Integer


'valida que se busque primero los periodos
If Me.TxtAño.Text = "" Then
'        Me.TxtAño.SetFocus
        Exit Sub
End If

If Me.Text1.Text = "" Then
'        Me.TxtAño.SetFocus
        Exit Sub
End If



'esto sucede antes de entrar al menu EN mIDfUNCIONES

'          If GStrEstRolDescansos = "ROLADO" Then
'             GStrNo_Rolvigente = GRsResultado!id_rol_anual
'             GStrAño_Rolvigente = Year(GRsResultado!fecha_ini)
'          Else
'             GStrEstRespalda_rol = ""
'          End If
'


'valida que si ya esta rolado No lo permite

If GStrEstRolDescansos = "" Or GStrEstRolDescansos = " " Then

Else
    If MsgBox("EL ROL VIGENTE YA FUE ROLADO, APARTIR DE ESTE MOMENTO LOS CAMBIOS SE GRABARAN EL ROL NO : " & GStrNo_Rolvigente & " DESEA RESPALDAR ? S/N ", vbQuestion + vbYesNo, GStrMensaje) = vbYes Then
       Else
          Exit Sub
    End If
End If


'para la barra (no calculo el maximo)

PBar.Min = 0
PBar.Max = TxtTotReg
LIntInd = 0

If Validaciones Then
    
          'Esta Variable se Balnquea si contestan que  N
          If TxtAño.Text = "" Then
             Exit Sub
          End If
          
'   If MsgBox("INICIA EL RESPALDO ? S/N ", vbQuestion + vbYesNo, GStrMensaje) = vbYes Then
         Call GCnCon
         Set GCnConexionBDRoles = New ADODB.Connection
         With GCnConexionBDRoles
'              .ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" & GstrRutaResp & "\BD_RolTaqSup.accdb;Persist Security Info=True;Jet OLEDB:Database Password:"
 '             .ConnectionString = "DSN=odbcroltaq;UID=taq_adm;PWD=taquilla;WSID=50.192.40.24;DATABASE=BD_RolTaqSup"
              .ConnectionString = "DSN=odbcroltaq;UID=usr_taquillas;PWD=Taquillas1234;WSID=50.192.41.212;DATABASE=BD_RolTaqSup"
              
              
              .Open
         End With

         Set GRsResultadoV = New ADODB.Recordset
         
    
             With GRsResultadoV
                  .CursorType = adOpenDynamic
                  .LockType = adLockOptimistic
                  .Source = "SELECT id_expediente, calificacion, id_tramo, turno FROM rol_taquilla WHERE id_expediente > 0 "
'                  .Source = "SELECT id_expediente, calificacion, id_tramo, turno FROM rol_taquilla "

              Set .ActiveConnection = GCnConexionBDRoles
                  .Open

                  'para la barra
                  PBar.Visible = True
                  'LblProgreso.Visible = True

                   If Not GRsResultadoV.EOF Then
                      While Not GRsResultadoV.EOF
                      
                    
                            GStrCadena = ""
                            GStrCadena = "INSERT INTO calif_roles_hist (id_expediente , calificacion, rol_año, rol_num, fec_ini_rol, fec_fin_rol, fecha_respaldo, inc_cargadas,id_tramo,turno ) " & _
                                         " VALUES(" & GRsResultadoV!id_expediente & ", " & Format(GRsResultadoV!calificacion, "###,##0.00") & ", " & _
                                         " " & Trim(Text1.Text) & "," & Trim(Text2.Text) & ",'" & Trim(Text5.Text) & "','" & Trim(Text6.Text) & "','" & Format(GStrFechaHoy, "yyyy-mm-dd") & "', '" & Trim(Text4.Text) & "','" & GRsResultadoV!id_tramo & "','" & GRsResultadoV!turno & "' )"
                            GCnConexion.Execute Replace(GStrCadena, "''", "null")

                            GRsResultadoV.MoveNext
                            
                            'para la barra
                            LIntInd = LIntInd + 1
                            PBar.Value = LIntInd

                      Wend
'                           Screen.MousePointer = vbDefault
                           MsgBox " TerminO Respaldo ", vbInformation, GStrMensaje
                   Else
                       MsgBox "No existen registros vigentes " & GstrRutaResp & " (rol_taquilla)... Verifique ", vbInformation, GStrMensaje
                   End If
             End With
             
             'para la barra
             PBar.Visible = False
             'LblProgreso.Visible = False
             
             GRsResultadoV.Close
             GCnConexionBDRoles.Close
             Call limpia
             CmdLimpiar_Click
'   Else
            'CAncelan el respaldo
            'para la barra
'             PBar.Visible = False
'             LblProgreso.Visible = False
'             Call limpia
'             CmdLimpiar_Click
'   End If
End If
Exit Sub
err1:
  MsgBox Err.Number & " " & Err.Description
  Resume
End Sub

Private Sub CmdLimpiar_Click()
 On Error GoTo err1
    Call limpia
    Me.GrdRolesDelAño.Rows = 2
    GIntR = 1
    While GIntR < Me.GrdRolesDelAño.Rows
          GIntC = 0
          While GIntC < Me.GrdRolesDelAño.Cols
                Me.GrdRolesDelAño.TextMatrix(GIntR, GIntC) = " "
                GIntC = GIntC + 1
          Wend
                GIntR = GIntR + 1
    Wend
Exit Sub
err1:
MsgBox Err.Number & " " & Err.Description
Resume
End Sub


Private Sub limpia()
On Error GoTo err1
    'Me.TxtAño.Text = ""
    Text1.Text = ""
    Text2.Text = ""
    Text3.Text = ""
    Text4.Text = ""
    Text5.Text = ""
    Text6.Text = ""
    Text7.Text = ""
    TxtTotReg = 0
Exit Sub

err1:
MsgBox Err.Number & " " & Err.Description
Resume

End Sub

Private Sub CmdSalir_Click()
    Call Visualiza_Menu_Principal
    Unload Me
    
End Sub

Private Sub Form_Activate()
    If GIntR > 2 Then
       If Not IsNull(Me.GrdRolesDelAño.TextMatrix(GIntR - 1, 4)) Then
           LStrUltimaFecha = Format(Me.GrdRolesDelAño.TextMatrix(GIntR - 1, 5), "yyyy-mm-dd")
           LStrUltimaFecha = LStrUltimaFecha + 1
        Else
           LStrUltimaFecha = Format(Date, "yyyy-mm-dd")
        End If
    Else
        LStrUltimaFecha = Format(Date, "yyyy-mm-dd")
    End If
    Me.TxtAño.Text = Year(LStrUltimaFecha)
    strAño = Year(LStrUltimaFecha)
    Call CmdBusc_Click
    
'    Me.TxtAño.SetFocus
End Sub

Private Sub Form_Initialize()
    LStrUltimaFecha = Format(Date, "yyyy-mm-dd")
End Sub

Private Sub Form_Load()
    GStrMensaje = "Respaldo de Roles del Año"
    Me.TabRolesDelAño.Tab = 0
    Me.GrdRolesDelAño.TextMatrix(0, 0) = "Año"
    Me.GrdRolesDelAño.TextMatrix(0, 1) = "Rol"
    Me.GrdRolesDelAño.TextMatrix(0, 2) = "Mes Incid"
    Me.GrdRolesDelAño.TextMatrix(0, 3) = "Fec_Ini"
    Me.GrdRolesDelAño.TextMatrix(0, 4) = "Fec_Fin"
    Me.GrdRolesDelAño.TextMatrix(0, 5) = "Fec_Respldo"
    Me.GrdRolesDelAño.TextMatrix(0, 6) = "Lugares"
        
    Me.GrdRolesDelAño.ColWidth(0) = 600
    Me.GrdRolesDelAño.ColWidth(1) = 400
    Me.GrdRolesDelAño.ColWidth(2) = 1500
    Me.GrdRolesDelAño.ColWidth(3) = 1500
    Me.GrdRolesDelAño.ColWidth(4) = 1500
    Me.GrdRolesDelAño.ColWidth(5) = 1500
    Me.GrdRolesDelAño.ColWidth(6) = 1000
    
    CmdLimpiar_Click
    
 
End Sub

Private Sub GrdRolesDelAño_LostFocus()
    Me.GrdRolesDelAño.CellBackColor = GCFondoColor
End Sub

Private Sub TabRolesDelAño_Click(PreviousTab As Integer)
On Error GoTo err1
    If TabRolesDelAño.Tab = 0 Then
       CmdLimpiar.Visible = True
    Else
       CmdLimpiar.Visible = False
    End If
Exit Sub
err1:
MsgBox Err.Number & " " & Err.Description
Resume
End Sub

Private Sub TxtAño_GotFocus()
   Call SCambiaColorActivo(TxtAño)
    Me.TxtAño.SelStart = 0
    Me.TxtAño.SelLength = 4
End Sub
Private Sub TxtAño_KeyPress(KeyAscii As Integer)
   If KeyAscii = 13 Then
       If TxtAño.Text <> "" Then
'          Me.TxtAño.SetFocus
       End If
    Else
        If (KeyAscii < 48 Or KeyAscii > 57) Then   ' permite el 0 y permite hasta el 9
             If (KeyAscii <> 8) Then
                 KeyAscii = 0
             End If
        End If
    End If
End Sub

Private Sub TxtAño_LostFocus()
    Me.TxtAño.BackColor = &HC0FFFF
End Sub


''Borra el respaldo del historico
''--------------------------------------------------

Private Sub Borra_Rol_respaldado()
  On Error GoTo err1
     Call GCnCon
     
     GStrCadena = "delete FROM calif_roles_hist " & _
                " WHERE rol_año = " & Me.Text1.Text & "  and  rol_num =  " & Me.Text2.Text & " "
     GCnConexion.Execute Replace(GStrCadena, "''", "null")
 
     Call GCnConClose
Exit Sub
err1:
  MsgBox Err.Number & " " & Err.Description
  Resume
End Sub


