FUNCTION MENSA(FILA,COLUMNA,TEXTO)
LOCA COLOR, HASTA:=COLUMNA+LEN(TEXTO)
LOCA PANMEN:=SAVESCREEN(FILA,COLUMNA,FILA,HASTA)
LOCA COLORANT:=SETCOLOR()
IF ISCOLOR()
   SETCOLOR("W+/R")
ELSE
   SETCOLOR("I")
ENDI
@FILA,COLUMNA SAY TEXTO
CLEA TYPE
INKEY(0)
SETCOLOR(COLORANT)
RESTSCREEN(FILA,COLUMNA,FILA,HASTA,PANMEN)
RETU

FUNC OKDIR(DIRE,FI,CO)     //  VERIFICA EXISTENCIA DIRECTORIO
LOCA EXISTE:=.T.
IF !FILE(DIRE+"\*.*")
   MENSA(FI,CO,"Seguro ? ==>"+TRIM(DIRE),.T.)
   EXISTE:=.F.
ENDI
RETU EXISTE

FUNC TOTALES()
LOCAL F:=C:=D:=R:=1
CLS
FOR F:=1 TO LEN(TOTAL)    // Filas
    D:=-10
    R++
    FOR C:=1 TO 3        // Columnas
        @R,D+=15 SAY TOTAL[F,C]
    NEXT
NEXT
@21,50 SAY "Un Print Screen..."
RETU

FUNC INIVEC(AREA)          //  Inicializaci¢n de vectores con nombres
LOCA ASTRU := {}, AUX := {} //  Locales de trabajo ...
ASTRU := (AREA)->(DBSTRUCT()) //  Generamos un multiarray muy £til ...
FOR K := 1 TO LEN(ASTRU)
   AADD(AUX,ASTRU[K,1])    //  El nombre del campo
NEXT
RETU AUX                   //  Devolvemos un array de nombres

FUNC SCROVERT(A,B,C)          // SCROLL VERTICAL DEL ACHOICE MENU PPAL.
* AUTOR: LUBRINA, Roberto         // (O de cualquier otro)
 IF LASTKEY()=27                  // Esc
    RETU 0
 ENDI
 IF LASTKEY()=13                  // Enter
    RETU 1
 ENDI
 IF LASTKEY()= 7                  // Del
    RETU 1
 ENDI
 IF LASTKEY()= 22                 // Ins
    RETU 1
 ENDI
 IF LASTKEY()=19.OR.LASTKEY()=4   // <==, ==>
    RETU 1
 ENDI 
 IF LASTKEY()>64.AND.LASTKEY()<123
    KEYBOARD CHR(5)+CHR(24)
    RETU 3
 ENDI
 IF A=1
    KEYBOARD CHR(30)                // Ctro PgDw
    RETU 2
 ELSE
    IF A=2
       KEYBOARD CHR(31)               // Ctro PgUp 
    ENDI
    RETU 2
 ENDI
RETU 3

FUNC OKSTRU(FIL1,FIL2)     //  Verificando la estructura
// FIL1 es el  rea del .dbf de control, la estructura de referencia ...
// FIL2 es el  rea del .dbf sobre el que se pretende trabajar
LOCA AREA := SELECT(), INDICE := INDEXORD(),STRU := {}
LOCA ASTR1, ASTR2, OK := .T.,ENUSO := .T.,IND             
IF FIL1 == FIL2
   MENSA(22,10,FIL1+' => '+FIL2+' Autocopy ? (!!!) ...',.T.)
   RETU .F.
ENDI
SELE (FIL1)
ASTR1 := INIVEC(FIL1)
IF SELECT(FIL2) <> 0       //  El .dbf a trabajar ya est  abierto
   SELE(FIL2)              //  Lo seleccionamos ...
ELSE
   ENUSO := .F.            //  Entonces lo abrimos
   SELE 29
   USE (FIL2) SHAR
ENDI
ASTR2 := INIVEC(FIL2)
IF LEN(ASTR1) <> LEN(ASTR2) //  Difieren en cant. de campos (FILAS)
   OK := .F.
ENDI
IF OK                      //  Ainda bem ...
   FOR I:=1 TO LEN(ASTR2)
      IF ASCAN(ASTR1,ASTR2[I])=0 //  No lo tenemos
	 OK=.F.
	 EXIT
      ENDI
   NEXT
ENDI
SELE(AREA)
SET ORDE TO INDICE   
RETU OK

FUNC ALIAX(HILERA)         //  Determina el alias
LOCA LON := LEN(HILERA),POS := 0 
FOR I := 1 TO LON
   IF SUBS(HILERA,I,1) = ':' .OR. SUBS(HILERA,I,1) = '\'
      POS := I
   ENDI
NEXT
RETU RTRI(SUBS(HILERA,POS+1,LON))

