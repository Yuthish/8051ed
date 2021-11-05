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
            delay = `   ORG 0000H                     <br> <br>              
                        ; Timer ${timer} Mode 1       <br>
                        MOV TMOD,#${TMOD}H            <br>
                        HERE:MOV TH${timer},#${TH}B   <br>
                             MOV TL${timer},#${TL}B   <br>
                             ACALL DELAY              <br>
                             SJMP HERE                <br><br>
                                                                                                            
                        ; Delay Subroutine            <br>
                        DELAY:SETB TR${timer}         <br>
                        AGAIN:JNB TF${timer},AGAIN    <br>       
                              CLR TR${timer}          <br>
                              CLR TF${timer}          <br>
                              RET                     <br>
                              END `

        } else if (mode === 2) {

            delay = `   ORG 0000H                                   <br> <br>                                                                                                                                                   
                        ; Timer ${timer} Mode 2 Auto reload Mode    <br>                                                                                                                                                   
                        MOV TMOD,#${TMOD}H                          <br>                                                                                                                                                   
                        MOV TH${timer},#${TH}B                      <br>                                                                                                                                                   
                        HERE:ACALL DELAY                            <br>                                                                                                                                                   
                             SJMP HERE                              <br> <br?                                                                                                                                                  
                                                                                                                
                         ; Delay Subroutine                         <br>                                                                                                                                                                                                                                                                                              <br><br>
                         DELAY:SETB TR${timer}                      <br>                                                                                                                                                   
                         AGAIN:JNB TF${timer},AGAIN                 <br>                                                                                                                                                   
                               CLR TR${timer}                       <br>                                                                                                                                                   
                               CLR TF${timer}                       <br>                                                                                                                                                   
                               RET                                  <br>                                                                                                                                                   
                               END`
        }

    }
    document.getElementById("TimerDelay").innerHTML = delay;



}

function serialCommunicationTxd(baudRate, data) {

    counter = data.length

    if (baudRate === "19200") {
        Txd = `  ORG 0000H                                            <br>
                 MAIN: MOV DPTR,#MYDATA                               <br> <br> 
                 ; Timer 1 Mode 2                                     <br>    
                 MOV TMOD,#20H                                        <br> <br>
                 ; 9600 Baud Rate                                     <br>               
                 MOV TH1,#-3                                          <br> <br>
                 ; Doubling Baud Rate using PCON Register (SMOD = 1)  <br>    
                 MOV A,PCON                                           <br>
                 SETB ACC.7                                           <br>
                 MOV PCON,A                                           <br> <br>
                 ; Serial Mode 1 REN Enabled                          <br>
                 MOV SCON,#50H                                        <br>                
                 SETB TR1                                             <br>
                 MOV R1,#${counter}                                   <br> <br>

                AGAIN:CLR A                                           <br>
                      MOVC A,@A+DPTR                                  <br>
                      MOV SBUF,A                                      <br> <br>

                HERE:JNB TI,HERE                                      <br>        
                     CLR TI                                           <br>
                     INC DPTR                                         <br>
                     DJNZ R1,AGAIN                                    <br>
                     SJMP MAIN                                        <br> <br>

                MYDATA: DB '${data}'                                  <br>
                END`                                               
           
    } else {
        TH1 = -(28800 / (baudRate))
        Txd = ` ORG 0000H                          <br>
                MAIN: MOV DPTR,#MYDATA             <br> <br> 
                      ; Timer 1 Mode 2             <br>
                      MOV TMOD,#20H                <br> <br>
                      ; ${baudRate} Baud Rate      <br>
                      MOV TH1,#${TH1}              <br> <br>
                      ; Serial Mode 1 REN Enabled  <br>
                      MOV SCON,#50H                <br>          
                      SETB TR1                     <br>
                      MOV R1,#${counter}           <br> <br>
                            
                AGAIN:CLR A                        <br>
                      MOVC A,@A+DPTR               <br>
                      MOV SBUF,A                   <br> <br>

                HERE:JNB TI,HERE                   <br>    
                     CLR TI                        <br>    
                     INC DPTR                      <br>   
                     DJNZ R1,AGAIN                 <br>
                     SJMP MAIN                     <br> <br>
                                                    
                MYDATA: DB "${data}"               <br>        
                END`
        
    }
    document.getElementById("txdSnippet").innerHTML = Txd
    

}

function serialCommunicationRxd(baudRate,receivingPort) {
    if (baudRate === "19200") {
        Rxd = `                             ORG 0000H                                                <br> <br> 
                                            ; Timer 1 Mode 2                                         <br>
                                            MOV TMOD,#20H                                            <br> <br>                            
                                            ; 9600 Baud Rate                                         <br>                                    
                                            MOV TH1,#-3                                              <br> <br>                           
                                            ; Doubling Baud Rate using PCON Register (SMOD = 1)      <br>                        
                                            MOV A,PCON                                               <br>                            
                                            SETB ACC.7                                               <br>                                            
                                            MOV PCON,A                                               <br> <br>                       
                                            ; Serial Mode 1 REN Enabled                              <br>                                        
                                            MOV SCON,#50H                                            <br>                                        
                                            SETB TR1                                                 <br> <br>                            

                                            HERE:JNB RI,HERE                                         <br>                            
                                                 MOV A,SBUF                                          <br>                                    
                                                 MOV ${receivingPort},A                              <br>                                        
                                                 CLR RI                                              <br>                                                
                                                 SJMP HERE                                           <br>                                                

                                            END`                                                                                        
            

    } else {
        TH1 = -(28800 / (baudRate))
        Rxd = `                                 ORG 0000H                       <br> <br>                                          
                                                ; Timer 1 Mode 2                <br>                                                      
                                                MOV TMOD,#20H                   <br> <br>                                                  
                                                ; ${baudRate} Baud Rate         <br>                                                  
                                                MOV TH1,#${TH1}                 <br> <br>                                                  
                                                ; Serial Mode 1 REN Enabled     <br>                                                          
                                                MOV SCON,#50H                   <br>                                                          
                                                SETB TR1                        <br> <br>                                                     
                                                                                          
                                                HERE:JNB RI,HERE                <br>                                      
                                                     MOV A,SBUF                 <br>                                                  
                                                     MOV ${receivingPort},A     <br>                                                          
                                                     CLR RI                     <br>                                                  
                                                     SJMP HERE                  <br>                                              

                                                END`                                                                                                            
    }
    document.getElementById("rxdSnippet").innerHTML = Rxd

}

function romToRam(romStartAddr,ramStartAddr,data){
    counter = data.length
    transfer = `    ORG 0000H                         <br> <br>                                      
                    ; ROM Starting Address            <br>                                          
                    MOV DPTR,#${romStartAddr}H        <br>                                                                
                    MOV R1,#${counter}                <br> <br>                                 
                    ; RAM Starting Address            <br>                                          
                    MOV R0,#${ramStartAddr}H          <br> <br>                                                                             

                    MAIN:CLR A                        <br>                                  
                         MOVC A,@A+DPTR               <br>                                                  
                         MOV @R0,A                    <br>                                          
                         INC DPTR                     <br>                                                          
                         INC R0                       <br>                                                                  
                         DJNZ R1,MAIN                 <br>                                           
                    HERE:SJMP HERE                    <br> <br>                                        
                    
                    ORG ${romStartAddr}H              <br>                                                              
                    DB '${data}'                      <br>                                  
                    END`                                                                

    return transfer

}




