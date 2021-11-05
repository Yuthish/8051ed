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
        
    }else{
    

    timerValue = timerValue.toString(2)
    TH = timerValue.slice(0, 8)
    TL = timerValue.slice(8, 16)
    

    if (mode === 1) {
        delay = `                                           ORG 0000H                                                                                                                                                                                           <br>              
                                                            MOV TMOD,#${TMOD}H              &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp ; Timer ${timer} Mode 1                      <br>
                                                            HERE:MOV TH${timer},#${TH}B                                                                                                                                                                         <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp              MOV TL${timer},#${TL}B                                                                                                                                                                         <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp              ACALL DELAY                                                                                                                                                                                    <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp              SJMP HERE                                                                                                                                                                                      <br>
                                                                                                                                                                                                                                                                <br> <br>
                    
                                                            DELAY:SETB TR${timer}           &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp  ; Delay Subroutine                          <br>
                                                            AGAIN:JNB TF${timer},AGAIN                                                                                                                                                                          <br>       
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TR${timer}                                                                                                                                                                                <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TF${timer}                                                                                                                                                                                <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         RET                                                                                                                                                                                           <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         END `
        
    }else{

    delay =`                                                ORG 0000H                                                                                                                                                                                           <br>
                                                            MOV TMOD,#${TMOD}H              &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp  ; Timer ${timer} Mode 2 Auto reload Mode    <br>
                                                            MOV TH${timer},#${TH}B                                                                                                                                                                              <br>
                                                            HERE:ACALL DELAY                                                                                                                                                                                    <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         SJMP HERE                                                                                                                                                                                           <br>
                                                                                                                                                                                                                                                                <br><br>
                                                            DELAY:SETB TR${timer}           &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp   ; Delay Subroutine                         <br>  
                                                            AGAIN:JNB TF${timer},AGAIN                                                                                                                                                                          <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TR${timer}                                                                                                                                                                                <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         CLR TF${timer}                                                                                                                                                                                <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         RET                                                                                                                                                                                           <br>
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp         END`                                                                                  
    }
    
    }
    document.getElementById("TimerDelay").innerHTML = delay;
}





