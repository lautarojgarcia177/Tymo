STORE 0 TO TOTLEI,TOTDOC,TOTNON
SELE 2
USE CARMED
SELE 1
USE LEGMED
CLS
   @10,10 SAY 'Seleccionando docentes ...'
   @12,10 SAY 'Leidos Docen NoDoc'
*              0123456789 1234567 
WHIL .NOT. EOF()
   TOTLEI = TOTLEI + 1
   IF NODOC(LEGAJO)
      TOTNON = TOTNON + 1
      IF RLOCK()
         DELE
      ENDI
   ELSE
      TOTDOC = TOTDOC + 1
   ENDI
   SKIP
   MENS = STR(TOTLEI,5)+'  '+STR(TOTDOC,5)+' '+STR(TOTNON,5)
   @14,10 SAY MENS
ENDD
@16,10 SAY 'Seleccion terminada'
GO TOP
PACK
@18,10 SAY 'Pack, tarea terminada'
QUIT
RETU

FUNC NODOC(LEG)
ND = .T.                   //  Inicialmente suponemos no docente
SELE 2
WHIL (LEG >= LEGAJO .AND. ND) //  Avancemos archivo de cargos
   IF LEG = LEGAJO         //  Que eres tu ?
      IF SUBS(CARGO,1,1) = '0'
         ND = .F.          // un docente ...
         EXIT
      ENDI
   ENDI
   SKIP
ENDD
SELE 1
RETU ND