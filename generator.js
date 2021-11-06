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
            delay = `ORG 0000H                   <br> <br>              
; Timer ${timer} Mode 1                          <br> 
MOV TMOD,#${TMOD}H                               <br> <br>
HERE:MOV TH${timer},#${TH}B                      <br> <br>
     MOV TL${timer},#${TL}B                      <br> <br>
     ACALL DELAY                                 <br> <br>
     SJMP HERE                                   <br> <br>
                                                                                    
; Delay Subroutine                               <br> 
DELAY:SETB TR${timer}                            <br> <br>
AGAIN:JNB TF${timer},AGAIN                       <br> <br>      
      CLR TR${timer}                             <br> <br>
      CLR TF${timer}                             <br> <br>
      RET                                        <br> <br>
      END `
            

        } else if (mode === 2) {

            delay = `ORG 0000H             <br> <br>                                                                                                                                                   
; Timer ${timer} Mode 2 Auto reload Mode   <br>                                                                                                                                                   
MOV TMOD,#${TMOD}H                         <br> <br>                                                                                                                                                  
MOV TH${timer},#${TH}B                     <br> <br>                                                                                                                                                  
HERE:ACALL DELAY                           <br> <br>                                                                                                                                                  
     SJMP HERE                             <br> <br>                                                                                                                                                  
                                                                                                                
; Delay Subroutine                         <br>                                                                                                                                                                                                                                                                                              <br><br>
DELAY:SETB TR${timer}                      <br> <br>                                                                                                                                                   
AGAIN:JNB TF${timer},AGAIN                 <br> <br>                                                                                                                                                   
      CLR TR${timer}                       <br> <br>                                                                                                                                                   
      CLR TF${timer}                       <br> <br>                                                                                                                                                   
      RET                                  <br> <br>                                                                                                                                                   
      END`
            
        
        }

    }
    document.getElementById("TimerDelay").innerHTML = delay;
    document.getElementById("delayCopyBtn").innerHTML =" <button onclick='myFunction()' onmouseout='outFunc()' class='ui linkedin  icon button'><span class='tooltiptext' id='myTooltip'> Copy to clipboard </span> <i class='clipboard icon'></i></button>" 

}

function serialCommunicationTxd(baudRate, data) {

    counter = data.length

    if (baudRate === "19200") {
        Txd = `ORG 0000H                                   <br> <br>
MAIN: MOV DPTR,#MYDATA                                     <br> <br> 
      ; Timer 1 Mode 2                                     <br>   
      MOV TMOD,#20H                                        <br> <br>
      ; 9600 Baud Rate                                     <br>               
      MOV TH1,#-3                                          <br> <br>
      ; Doubling Baud Rate using PCON Register (SMOD = 1)  <br>   
      MOV A,PCON                                           <br> <br>
      SETB ACC.7                                           <br> <br>
      MOV PCON,A                                           <br> <br>
      ; Serial Mode 1 REN Enabled                          <br> 
      MOV SCON,#50H                                        <br> <br>                
      SETB TR1                                             <br> <br>
      MOV R1,#${counter}                                   <br> <br>

AGAIN:CLR A                                          <br> <br>
      MOVC A,@A+DPTR                                 <br> <br>  
      MOV SBUF,A                                     <br> <br>
HERE:JNB TI,HERE                                     <br> <br>       
     CLR TI                                          <br> <br>
     INC DPTR                                        <br> <br>
     DJNZ R1,AGAIN                                   <br> <br>
     SJMP MAIN                                       <br> <br>
MYDATA: DB '${data}'                                 <br> <br>
END`                                               
           
    } else {
        TH1 = -(28800 / (baudRate))
        Txd = `ORG 0000H           <br> <br>
MAIN: MOV DPTR,#MYDATA             <br> <br>
      ; Timer 1 Mode 2             <br> 
      MOV TMOD,#20H                <br> <br>
      ; ${baudRate} Baud Rate      <br> 
      MOV TH1,#${TH1}              <br> <br>
      ; Serial Mode 1 REN Enabled  <br> 
      MOV SCON,#50H                <br> <br>         
      SETB TR1                     <br> <br>
      MOV R1,#${counter}           <br> <br>
                            
AGAIN:CLR A                  <br> <br>
      MOVC A,@A+DPTR         <br> <br>
      MOV SBUF,A             <br> <br>

HERE:JNB TI,HERE             <br> <br>    
     CLR TI                  <br> <br>    
     INC DPTR                <br> <br>   
     DJNZ R1,AGAIN           <br> <br>
     SJMP MAIN               <br> <br> 
                                                    
MYDATA: DB "${data}"         <br> <br>       
END`
        
    }
    document.getElementById("txdSnippet").innerHTML = Txd
    document.getElementById("txdCopyBtn").innerHTML =" <button onclick='txdCopyFunction()' onmouseout='outFunc()' class='ui linkedin  icon button'><span class='tooltiptext' id='myTooltip'> Copy to clipboard </span> <i class='clipboard icon'></i></button>" 
    

}

function serialCommunicationRxd(baudRate,receivingPort) {
    if (baudRate === "19200") {
        Rxd = `ORG 0000H                                 <br> <br> 
; Timer 1 Mode 2                                         <br> 
MOV TMOD,#20H                                            <br> <br>                            
; 9600 Baud Rate                                         <br>                                   
MOV TH1,#-3                                              <br> <br>                           
; Doubling Baud Rate using PCON Register (SMOD = 1)      <br>                        
MOV A,PCON                                               <br> <br>                           
SETB ACC.7                                               <br> <br>                                           
MOV PCON,A                                               <br> <br>                       
; Serial Mode 1 REN Enabled                              <br>                                        
MOV SCON,#50H                                            <br> <br>                                       
SETB TR1                                                 <br> <br>                            

HERE:JNB RI,HERE                                         <br> <br>                           
    MOV A,SBUF                                           <br> <br>                                   
    MOV ${receivingPort},A                               <br> <br>                                       
    CLR RI                                               <br> <br>                                               
    SJMP HERE                                            <br> <br>                                               
    END`                                                                                        
            

    } else {
        TH1 = -(28800 / (baudRate))
        Rxd = `ORG 0000H        <br> <br>                                          
; Timer 1 Mode 2                <br>                                                      
MOV TMOD,#20H                   <br> <br>                                                  
; ${baudRate} Baud Rate         <br>                                                  
MOV TH1,#${TH1}                 <br> <br>                                                  
; Serial Mode 1 REN Enabled     <br>                                                          
MOV SCON,#50H                   <br> <br>                                                         
SETB TR1                        <br> <br>                                                     
                                                                                          
HERE:JNB RI,HERE                <br> <br>                                     
     MOV A,SBUF                 <br> <br>                                                 
     MOV ${receivingPort},A     <br> <br>                                                         
     CLR RI                     <br> <br>                                                 
     SJMP HERE                  <br> <br>                                             
     END`                                                                                                            
    }
    document.getElementById("rxdSnippet").innerHTML = Rxd
    document.getElementById("rxdCopyBtn").innerHTML =" <button onclick='rxdCopyFunction()' onmouseout='outFunc()' class='ui linkedin  icon button'><span class='tooltiptext' id='myTooltip'> Copy to clipboard </span> <i class='clipboard icon'></i></button>" 

}

function romToRam(romStartAddr,ramStartAddr,data){
    counter = data.length
    transfer = `ORG 0000H         <br> <br>                                      
; ROM Starting Address            <br>                                          
MOV DPTR,#${romStartAddr}H        <br> <br>                                                               
MOV R1,#${counter}                <br> <br>                                 
; RAM Starting Address            <br>                                        
MOV R0,#${ramStartAddr}H          <br> <br>                                                                             

MAIN:CLR A                        <br> <br>                                 
     MOVC A,@A+DPTR               <br> <br>                                                 
     MOV @R0,A                    <br> <br>                                         
     INC DPTR                     <br> <br>                                                         
     INC R0                       <br> <br>                                                                 
     DJNZ R1,MAIN                 <br> <br>                                          
HERE:SJMP HERE                    <br> <br>                                        
                    
ORG ${romStartAddr}H              <br> <br>                                                             
DB '${data}'                      <br> <br>                                 
END`                                                                
    
    document.getElementById("transferSnippet").innerHTML = transfer
    document.getElementById("transferCopyBtn").innerHTML =" <button onclick='transferCopyFunction()' onmouseout='outFunc()' class='ui linkedin  icon button'><span class='tooltiptext' id='myTooltip'> Copy to clipboard </span> <i class='clipboard icon'></i></button>" 

}





