function GetSelectedTextValue(ddlSuggestion) {
    var selectedValue = ddlSuggestion.value;
    if(selectedValue=="2")
    {
    document.getElementById("txtComments").style.display = '';
    }
    else
    {
    document.getElementById("txtComments").style.display = 'none';
    }
    }