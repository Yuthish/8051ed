def timerDelay(timer,mode,delayInMilliSeconds):
  
  if (timer == 0):
    TMOD ='0'+f'{mode}' 
  elif (timer == 1):
    TMOD = f'{mode}'+'0'

  delayInMilliSeconds = round(delayInMilliSeconds*1000/1.085)
  timerValue = bin(65536 - delayInMilliSeconds).replace("0b","")
  
  TH = timerValue[0:8]
  TL = timerValue[8:16]

  if(mode == 1):
    delay =f"""ORG 0000H
MOV TMOD,#{TMOD}H                      ; Timer {timer} Mode 1  
HERE: MOV TH{timer},#{TH}B
      MOV TL{timer},#{TL}B
      ACALL DELAY
      SJMP HERE

DELAY: SETB TR{timer}                    ; Delay Subroutine   
AGAIN: JNB TF{timer},AGAIN
       CLR TR{timer}
       CLR TF{timer}
       RET
       END """

    
    
    return(delay)  
   

 
  delay = f"""ORG 0000H
MOV TMOD,#{TMOD}H                        ; Timer {timer} Mode 2 Auto reload Mode
MOV TH{timer},#{TH}B                     

HERE: ACALL DELAY
      SJMP HERE

DELAY: SETB TR{timer}                      ; Delay Subroutine     
AGAIN: JNB TF{timer},AGAIN
       CLR TR{timer}
       CLR TF{timer}
       RET
       END """
  return delay


# Testing
delay1 = timerDelay(0,1,1)
delay2 = timerDelay(1,2,2)
print(delay1)
print("")
print(delay2)
