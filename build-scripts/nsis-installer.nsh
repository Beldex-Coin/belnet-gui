!macro customInstall
    nsExec::Exec '"sc.exe" failure belnet reset= 60 actions= restart/5000'
!macroend