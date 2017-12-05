
    // ---------------------------------- //
    //      Wait For All To Load In       //
    //   Then Display It All On Screen    //
    // ---------------------------------- //
var ya;
var myVar;
var levelChosen;
var difficultyChosen;

function myFunction() {
    myVar = setTimeout(showPage, 3000);
}

function showPage() {

    document.getElementById("loader").style.display = "none";
    document.getElementById("main-wrapper").style.display = "block";
    $('html').css('background', 'transparent');

}

$( document ).ready(function() {
    $("#levelList").val($("#levelList option:first").val());    
    $("#difficultyList").val($("#difficultyList option:first").val());    
    
    
    
    // When Start Button Is Clicked
    $( "#btnStart" ).click(function() {        
        
        if(typeof levelChosen !== 'undefined' && typeof difficultyChosen !== 'undefined')
        {
            document.getElementById("ifError").innerHTML = "";
            ya = setTimeout(openGamePage, 3000);
            
            $("#btnStart").text(function(i, text){
                return text === "You Ready!" ? "OK Wait, Loading" : "Yeah Yeah, Hold On";
            });
        }
        else
        {
            if(levelChosen == null  && difficultyChosen != null)  
                document.getElementById("ifError").innerHTML = "You Didn't Choose How Many Levels You Want";
            else if(difficultyChosen == null && levelChosen != null)
                document.getElementById("ifError").innerHTML = "You Didn't Choose What Difficulty You Want";
            else if(levelChosen == null  && difficultyChosen == null )
                document.getElementById("ifError").innerHTML = "You Didn't Choose The Difficulty And Levels You Want";
            else
                document.getElementById("ifError").innerHTML = "Something Screwed Up, NOT Your Fault. Come Back Later";
            
        }
    })


})

function openGamePage()
{
    localStorage.setItem("levelsChosen", levelChosen);
    localStorage.setItem("difficultyChosen", difficultyChosen);
    window.location.href = 'Game.html';
}

function reportLevels(period)
{
    if(period == "")return;

    levelChosen = period;
}

function reportDifficulty(period)
{
    if(period == "")return;

    difficultyChosen = period;
}
