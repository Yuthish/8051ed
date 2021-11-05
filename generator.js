function timerDelay(timer, mode, delayInMilliSeconds) {
    timer = parseInt(timer)
    mode = parseInt(mode)
    delayInMilliSeconds = parseInt(delayInMilliSeconds)
    let delay = ""

    if (timer === 0) {
        TMOD = `0${mode}`
    } else {
        TMOD = `${mode}0`
    }

    delayInMilliSeconds = Math.round((delayInMilliSeconds * 1000) / 1.085)
    timerValue = 65536 - delayInMilliSeconds

    if (timerValue < 0) {
        delay = "Value Out Of Bound"

    } else {
        timerValue = timerValue.toString(2)
        TH = timerValue.slice(0, 8)
        TL = timerValue.slice(8, 16)

        if (mode === 1) {
            delay = `                                           ORG 0000H                                                                                                                                                                                           <br>              
                                                                MOV TMOD,#${TMOD}H              &nbsp &nbsp ; Timer ${timer} Mode 1                      <br>
                                                                HERE:MOV TH${timer},#${TH}B                                                                                                                                                                         <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp              MOV TL${timer},#${TL}B                                                                                                                                                                         <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp              ACALL DELAY                                                                                                                                                                                    <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp              SJMP HERE                                                                                                                                                                                      <br>
                                                                                                                                                                                                                                                                    <br> <br>
                        
                                                                DELAY:SETB TR${timer}           &nbsp &nbsp  ; Delay Subroutine                          <br>
                                                                AGAIN:JNB TF${timer},AGAIN                                                                                                                                                                          <br>       
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TR${timer}                                                                                                                                                                                <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TF${timer}                                                                                                                                                                                <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         RET                                                                                                                                                                                           <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         END `

        } else if (mode === 2) {

            delay = `                                           ORG 0000H                                                                                                                                                                                           <br>
                                                                MOV TMOD,#${TMOD}H  &nbsp &nbsp                ; Timer ${timer} Mode 2 Auto reload Mode    <br>
                                                                MOV TH${timer},#${TH}B                                                                                                                                                                              <br>
                                                                HERE:ACALL DELAY                                                                                                                                                                                    <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         SJMP HERE                                                                                                                                                                                           <br>
                                                                                                                                                                                                                                                                    <br><br>
                                                                DELAY:SETB TR${timer} &nbsp &nbsp   ; Delay Subroutine                         <br>  
                                                                AGAIN:JNB TF${timer},AGAIN                                                                                                                                                                          <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TR${timer}                                                                                                                                                                                <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TF${timer}                                                                                                                                                                                <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         RET                                                                                                                                                                                           <br>
                    &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         END`
        }

    }
    document.getElementById("TimerDelay").innerHTML = delay;



}

function serialCommunicationTxd(baudRate, data) {

    counter = data.length

    if (baudRate === 19200) {
        Txd = `                             ORG 0000H
                                            MAIN: MOV DPTR,#MYDATA
                                            MOV TMOD,#20H                   ; Timer 1 Mode 2 
                                            MOV TH1,#-3                     ; 9600 Baud Rate 
                                            MOV A,PCON
                                            SETB ACC.7                      ; Doubling Baud Rate using PCON Register (SMOD = 1)
                                            MOV PCON,A
                                            MOV SCON,#50H                   ; Serial Mode 1 REN Enabled
                                            SETB TR1
                                            MOV R1,#${counter}

                                            AGAIN:CLR A
                                                  MOVC A,@A+DPTR
                                                  MOV SBUF,A

                                            HERE:JNB TI,HERE
                                                 CLR TI
                                                 INC DPTR
                                                 DJNZ R1,AGAIN
                                                 SJMP MAIN
                                            
                                            MYDATA: DB '${data}'
                                            END`
            return Txd;

    } else {
        TH1 = -(28800 / (baudRate))
        Txd = `                                 ORG 0000H
                                                MAIN: MOV DPTR,#MYDATA
                                                      MOV TMOD,#20H             ; Timer 1 Mode 2 
                                                      MOV TH1,#${TH1}           ; ${baudRate} Baud Rate
                                                      MOV SCON,#50H             ; Serial Mode 1 REN Enabled
                                                      SETB TR1
                                                      MOV R1,#${counter}
                            
                                                      AGAIN:CLR A
                                                            MOVC A,@A+DPTR
                                                            MOV SBUF,A

                                                      HERE:JNB TI,HERE
                                                           CLR TI
                                                           INC DPTR
                                                           DJNZ R1,AGAIN
                                                           SJMP MAIN
                                                    
                                                MYDATA: DB '${data}'
                                                END`
        return Txd;
    }
    

}

function serialCommunicationRxd(baudRate,receivingPort) {
    if (baudRate === 19200) {
        Rxd = `                             ORG 0000H
                                            MOV TMOD,#20H                   ; Timer 1 Mode 2 
                                            MOV TH1,#-3                     ; 9600 Baud Rate 
                                            MOV A,PCON
                                            SETB ACC.7                      ; Doubling Baud Rate using PCON Register (SMOD = 1)
                                            MOV PCON,A
                                            MOV SCON,#50H                   ; Serial Mode 1 REN Enabled
                                            SETB TR1
                                            
                                            HERE:JNB RI,HERE
                                                 MOV A,SBUF
                                                 MOV ${receivingPort},A
                                                 CLR RI
                                                 SJMP HERE
                                           
                                            END`
            return Rxd;

    } else {
        TH1 = -(28800 / (baudRate))
        Rxd = `                                 ORG 0000H
                                    
                                                MOV TMOD,#20H               ; Timer 1 Mode 2 
                                                MOV TH1,#${TH1}             ; ${baudRate} Baud Rate
                                                MOV SCON,#50H               ; Serial Mode 1 REN Enabled
                                                SETB TR1
                        
                                                HERE:JNB RI,HERE
                                                     MOV A,SBUF
                                                     MOV ${receivingPort},A
                                                     CLR RI
                                                     SJMP HERE
 
                                                END`
    }
    return Rxd

}

function romToRam(romStartAddr,ramStartAddr,data){
    counter = data.length
    transfer = `    ORG 0000H
                    MOV DPTR,#${romStartAddr}H              ; ROM Starting Address
                    MOV R1,#${counter}
                    MOV R0,#${ramStartAddr}H                ; RAM Starting Address

                    MAIN:CLR A
                         MOVC A,@A+DPTR
                         MOV @R0,A
                         INC DPTR
                         INC R0
                         DJNZ R1,MAIN   
                    HERE:SJMP HERE     
                    
                    ORG ${romStartAddr}H
                    DB '${data}'
                    END`

    return transfer

}



