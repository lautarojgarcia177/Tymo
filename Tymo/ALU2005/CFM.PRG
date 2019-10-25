LOCAL PANT:=SAVESCREEN()
SET SCOREBOARD OFF
SET WRAP ON
SET EPOCH TO 1900
SET DATE ITAL  
SET CENT ON
SET DELE ON


//              TABLAS DE EQUIVALENCIAS
//              =======================


//              ESTADO => SIT_CONY
PRIV aEstado := {'1','2','3','4','5'}
PRIV aSit_Co := {'1','2','3','4','4'}

//              PROV_NAC => NAC_PROV
PRIV aProvNa := {'B', 'C', 'K', 'X', 'W', 'H', 'U', 'E', 'P', 'Y', 'L', 'F',;
                 'M', 'N', 'Q', 'R', 'A', 'D', 'J', 'Z', 'S', 'G', 'V', 'T'} 
PRIV aNaProv := {'06','32','10','14','18','22','XX','YY','34','38','42','46',;
                 '50','54','58','62','66','70','74','78','82','86','94','90'}

//              PAIS_NAC => NAC_PAIS
PRIV aPaisNa := {'10',  '73',  '74',  '75',  '76',  '77',  '78',;
                 '79',  '83',  '91',  '95',  '96'}
PRIV aNaPais := {'54  ','598 ','55  ','595 ','591 ','56  ','51  ',;
                 '8103','8101','8104','8105','8102'}

//              DTO_PRO  => PRO_DPTO
PRIV aDtoPro := {'01', '02', '03', '04', '05', '06', '07', '08', '09',;
                 '10', '11', '12', '13', '14', '15', '16', '17', '18',;
                 '19', '20', '21', '22', '23', '24', '25', '26'}
PRIV aProDto := {'014','007','021','028','035','042','049','056','063',;
                 '170','177','084','091','098','105','112','119','126',;
                 '133','140','147','154','161','168','175','182'}

//              OBRA_SOC => OBRA_SOC
PRIV aObraSo := {'1','2','3','4'}
PRIV aSoObra := {'3','2','2','1'}

//              BECA     => TIP_BECA
PRIV aBecaTi := {'2','3','4'}
PRIV aTiBeca := {'1','2','4'}

//              DEP_CUA  => DEPORT_1
PRIV aDepCua := {'1','2','3','4','5','6','7','8'}
PRIV aCuaDep := {'1','2','3','4','5','6','7','9'}

//              EST_PAD  => ESTU_PAD (Lo mismo para madre)
PRIV aEstPad := {'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
PRIV aPadEst := {'1 ','2 ','3 ','4 ','5 ','8 ','9 ','10','11','12'}

PRIV aOcuPri := {'10','21','22','23','31','32','33','41','42',;
                 '43','50','60','70','80','90','98','99'}
PRIV aPriOcu := {'1 ','2 ','3 ','4 ','5 ','6 ','7 ','8 ','8 ',;
                 '9 ','11','12','13','14','15','16','18'}
                 
@00,00 CLEAR TO 23,79
@02,00 SAY " REFORMATEADOR FICHA CATASTRAL/MATRICULA ALUMNOS/ALUMNOSI.dbf"
@04,00 SAY ' Este programa reformatea el archivo ALUMNOS y ALUMNOSI.dbf llevandolo al for' 
@05,00 SAY 'mato requerido por los nuevos documentos SUR 8 (Ficha Catastral) y SUR 2 (Fi-'
//          0123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789
@06,00 SAY 'cha anual) vigentes a partir del a¤o 2005. Requiere (Y verifica) que dicho ar-'
@07,00 SAY 'chivo tenga ya formato compatible 2000. Los respectivos archivos de salida son '
@08,00 SAY 'generados en el directorio destino.'
@09,00 SAY ' El proceso puede ser corrido una o varias veces.'

@11,00 SAY ' Finalizado, retornar archivos convertidos a sus respectivos directorios ori'
@12,00 SAY 'gen e indizarlos usando el nuevo ejecutable ALUMNOS.exe'

PRIV WPATHCO:=WPATHHI:=WPATHDC:=WPATH:=WCURDIR:=SPACE(30)
PRIV Fld2000, Fld2005
PRIV TOTAL:={{"BASE     ","       LEIDOS","  REFORMATEADOS"},;
             {"ALUMNOS  ",0,0},;  //  2
             {"ALUMNOSI ",0,0}}   //  3

IF FILE("CFM.MEM")
   REST FROM CFM ADDI
ENDI
MENSA(23,60,"Comenzamos?...",.T.)
RESTSCREEN(PANT)

IF LASTKEY()<>27
   PROCESO()
   CLOSE ALL
ENDI 

CLS
TOTALES()
MENSA(23,10,'No olvide retornar archivos convertidos e indizarlos ...',.T.)
CLS
SET DEFA TO
SAVE TO CFM ALL LIKE W*
QUIT

FUNC PROCESO()
LOCA PANTC:=SAVESCREEN()
PRIV BORRAR,uVez:=.T.
CLS

WHILE .T.
   @08,10 SAY "Directorio progr. conversor    " GET Wcurdir VALID;
   OKDIR(Wcurdir,ROW()+1,10)
   @10,10 SAY "Directorio origen ALUMNOS      " GET WPATHCO VALID;
   OKDIR(WPATHCO,ROW()+1,10)
   @12,10 SAY "Directorio origen ALUMNOSI     " GET WPATHHI VALID; 
   OKDIR(WPATHHI,ROW()+1,10)
   @14,10 SAY "Directorio destino convertidos " GET WPATHDC VALID; 
   OKDIR(WPATHDC,ROW()+1,10)
   READ
   IF LASTKEY()=27
      EXIT
   ENDI
   MENSA(22,30,"Convertimos ALUMNOS.dbf ?",.T.)
   IF LASTKEY()=13
      PROCES01()
   ENDI
   MENSA(22,30,"Convertimos ALUMNOSI.dbf ?",.T.)
   IF LASTKEY()=13
      PROCES02()
   ENDI
   EXIT
ENDD 
RETU

FUNC PROCES01()
LOCA PANTA:=SAVESCREEN(20,00,23,79)
LOCA TREG,NUE,CONTROL,ENTRADA
SET DEFA TO (RTRIM(WPATHDC))
PRIV SALIDA:=RTRIM(WPATHDC)+'\ALUMNOS.DBF'
SET DEFA TO (RTRIM(WCURDIR)) //  Directorio programa conversor 
SELE 1
USE Alu2005 SHAR          //  Estructura alumnos target
COPY STRU TO &SALIDA
Fld2005:=INIVEC('Alu2005') //  Los campos destino
USE Alu2000 SHAR          //  Estructura Alumnos Source
CONTROL:=ALIAX(RTRI(WCURDIR)+'\Alu2000')
SET DEFA TO (RTRIM(WPATHDC))
SELE 14
USE ALUMNOS
SET DEFA TO (RTRIM(WPATHCO)) //  Directorio de datos source
SELE 4
USE
USE ALUMNOS SHAR             // Alumnos.dbf corriente
GO TOP
IF !OKSTRU(CONTROL,'ALUMNOS')   //  Aqu¡ con problemitas ...
   MENSA(20,20,'Estructura ALUMNOS.dbf incorrecta',.T.)
   RETU
ENDI        
Fld2000:=INIVEC('ALUMNOS') //  Los campos origen
WHILE !EOF()
   REGISTRO()
   TOTAL[2,2]++
   IF DELETED()
      SKIP
      LOOP 
   ENDI   
   sCambios(4,14)          // Copiamos desde, hasta, campos comunes   
   equivale(4,14)          // Aplicamos tabla de equivalencia
   TOTAL[2,3]++
   SKIP
ENDD
RESTSCREEN(20,00,23,79,PANTA)
RETU
CLOSE ALL
RETU

FUNC PROCES02()
LOCA PANTA:=SAVESCREEN(20,00,23,79)
LOCA TREG,NUE,CONTROL,ENTRADA
SET DEFA TO (RTRIM(WPATHDC))
PRIV SALIDA:=RTRIM(WPATHDC)+'\ALUMNOSI.DBF'
SET DEFA TO (RTRIM(WCURDIR)) //  Directorio programa conversor 
SELE 1
USE Alu2005 SHAR          //  Estructura alumnos target
COPY STRU TO &SALIDA
Fld2005:=INIVEC('Alu2005') //  Los campos destino
USE Alu2000 SHAR          //  Alumnos Source
CONTROL:=ALIAX(RTRI(WCURDIR)+'\Alu2000')
SET DEFA TO (RTRIM(WPATHDC))
SELE 12
USE ALUMNOSI
SET DEFA TO (RTRIM(WPATHHI)) //  Directorio de datos source
SELE 2
USE
USE ALUMNOSI SHAR
GO TOP
IF !OKSTRU(CONTROL,'ALUMNOSI') //  Aqu¡ con problemitas ...
   MENSA(20,20,'Estructura ALUMNOSI.dbf incorrecta',.T.)
   RETU
ENDI        
TREG:=LTRIM(STR(RECCOUNT())) //  Total de registros
@20,10 SAY "Reformateando ALUMNOSI ..."+TREG+" registros"
Fld2000:=INIVEC('ALUMNOSI')     //  Los campos ...
WHILE !EOF()
   REGISTRO()
   TOTAL[3,2]++
   IF DELETED()
      SKIP
      LOOP 
   ENDI   
   sCambios(2,12)          //  Copiamos desde, hasta, campos comunes 
   equivale(2,12)          // Aplicamos tabla de equivalencia
   TOTAL[3,3]++
   SKIP
ENDD 
RESTSCREEN(20,00,23,79,PANTA)
RETU  
CLOSE ALL
RETU  

FUNC REGISTRO()            //  MUESTRA NUMERO DE REGISTRO
@22,32 SAY RECNO()
RETU  

FUNC sCambios(SOUR,TARJ)      //  Copia campos sin cambios,un area a otra.
LOCA AREA := SELECT(), INDICE := INDEXORD(), au2000, au2005, auxInd
SELE(TARJ) 
APPE BLANK                 //  SOUR  Alias de origen
IF !NETERR()               //  TARJ  Alias de destino
   FOR K=1 TO len(Fld2000)
      au2000:= RTRI(Fld2000[K]) //  Nombre campo origen
      auxInd:= ASCAN(Fld2005,Au2000)
      IF auxInd > 0        // Puede que exista en .dbf salida
         au2005:=RTRI(Fld2005[auxInd])
         REPL &au2005 WITH &SOUR->&au2000
      ENDI
   NEXT
ENDI
SELE(AREA)
SET ORDE TO INDICE
RETU 

FUNC equivale(SOUR,TARJ)      //  Completa los datos nuevos, si posible      
LOCA AREA := SELECT(), INDICE := INDEXORD()
SELE (TARJ)
IF !NETERR()
   REPL SIT_CONY WITH convEst(&SOUR->ESTADO)
   REPL TIE_HIJO WITH &SOUR->HIJOS
   REPL NAC_PROV WITH convPro(&SOUR->PROV_NAC)
   REPL NAC_PAIS WITH convPai(&SOUR->PAIS_NAC) 
   REPL PRO_DPTO WITH convDto(&SOUR->DTO_PRO) 
   REPL PRO_PROV WITH convPro(&SOUR->PROV_PRO)
   REPL PRO_PAIS WITH convPai(&SOUR->PAIS_PRO) 
   REPL OBRA_SOC WITH convObr(&SOUR->OBRA_SOC) 
   REPL DPTO_ESC WITH convDto(&SOUR->DEP_ESC) 
   REPL PROV_ESC WITH convPro(&SOUR->PROV_ESC)
   REPL PAIS_ESC WITH convPai(&SOUR->PAIS_ESC) 
   REPL ANO_EGRE WITH &SOUR->ANO_EGR
   REPL TIP_BECA WITH convBec(&SOUR->BECA)
   IF &SOUR->BECA = '1'    // No tiene beca
      REPL TIE_BECA WITH '2' 
   ENDI
   IF &SOUR->BECA $'234'
      REPL TIE_BECA WITH '1'
   ENDI
   REPL RELA_TRA WITH &SOUR->RELAC
   REPL HORA_SEM WITH &SOUR->HORAS
   REPL RAMA_ACT WITH &SOUR->RAMA
   IF !EMPTY(&SOUR->DEPORTE)  //  Si practica deporte,
      IF &SOUR->DEP_DON = '1' // si lo hace en la U.N.C.
         REPL PRAC_UNC WITH '1'
         REPL PRAC_OTR WITH '2'
      ELSE
         REPL PRAC_UNC WITH '2'
         REPL PRAC_OTR WITH '1'
      ENDI
      REPL DEPORT_1 WITH convDep(&SOUR->DEP_CUA)
   ENDI
   REPL ESTU_PAD WITH convEstu(&SOUR->EST_PAD) 
   REPL ESTU_MAD WITH convEstu(&SOUR->EST_MAD) 
   IF !EMPTY(&SOUR->SIT_PAD) // Situacion laboral padre
      IF &SOUR->SIT_PAD = '8' // Fallecido
         REPL VIVE_PAD WITH '2'
      ELSE
         REPL VIVE_PAD WITH '1'
      ENDI
      REPL SITLAB_P WITH &SOUR->SIT_PAD
   ENDI
   IF !EMPTY(&SOUR->SIT_MAD) // Situacion laboral padre
      IF &SOUR->SIT_MAD = '8' // Fallecido
         REPL VIVE_MAD WITH '2'
      ELSE
         REPL VIVE_MAD WITH '1'
      ENDI
      REPL SITLAB_M WITH &SOUR->SIT_MAD
   ENDI
   REPL OCUP_PAD WITH convOcu(&SOUR->OCU_PAD) 
   REPL OCUP_MAD WITH convOcu(&SOUR->OCU_MAD) 
   REPL RAMA_PAD WITH &SOUR->RAM_PAD
   REPL RAMA_MAD WITH &SOUR->RAM_MAD
ENDI
SELE(AREA)
SET ORDE TO INDICE
RETU 


FUNC convEst(key)
LOCA auxRet:=' '
LOCA ind := ASCAN(aEstado,key)
IF ind > 0
   auxret = aSit_Co[ind]
ENDI
RETU auxRet

FUNC convPro(key)
LOCA auxRet:='  '
LOCA ind := ASCAN(aProvNa,key)
IF ind > 0
   auxret = aNaProv[ind]
ENDI
RETU auxRet

FUNC convPai(key)
LOCA auxRet:='    '
LOCA ind := ASCAN(aPaisNa,key)
IF ind > 0
   auxret = aNaPais[ind]
ENDI
RETU auxRet

FUNC convObr(key)
LOCA auxRet:=' '
LOCA ind := ASCAN(aObraSo,key)
IF ind > 0
   auxret = aSoObra[ind]
ENDI
RETU auxRet


FUNC convDto(key)
LOCA auxRet:='   '
LOCA ind := ASCAN(aDtoPro,key)
IF ind > 0
   auxret = aProDto[ind]
ENDI
RETU auxRet

FUNC convBec(key)
LOCA auxRet:=' '
LOCA ind := ASCAN(aBecaTi,key)
IF ind > 0
   auxret = aTiBeca[ind]
ENDI
RETU auxRet

FUNC convDep(key)
LOCA auxRet:=' '
LOCA ind := ASCAN(aDepCua,key)
IF ind > 0
   auxret = aCuaDep[ind]
ENDI
RETU auxRet

FUNC convEstu(key)
LOCA auxRet:='  '
LOCA ind := ASCAN(aEstPad,key)
IF ind > 0
   auxret = aPadEst[ind]
ENDI
RETU auxRet

FUNC convOcu(key)
LOCA auxRet:='  '
LOCA ind := ASCAN(aOcuPri,key)
IF ind > 0
   auxret = aPriOcu[ind]
ENDI
RETU auxRet
