if application "Music" is not running then
    return "STOPPED||"
else
    try
        tell application "Music"
            set playerstate to player state
            set playerposition to player position
            set songduration to duration of current track

            if playerstate is not playing and playerstate is not paused then
                return "STOPPED||"
            else
                if playerstate is playing then
                    return "PLAYING||" & name of current track & "||" & artist of current track & "||" & album of current track & "||" & playerposition & "||" & songduration
                else
                    return "PAUSED||" & name of current track & "||" & artist of current track & "||" & album of current track & "||" & playerposition & "||" & songduration
                end if
            end if
        end tell
    on error
        return "STOPPED||"
    end try
end if
