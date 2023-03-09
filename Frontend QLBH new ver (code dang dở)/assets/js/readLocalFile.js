function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var content 
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                content = allText.substring(allText.indexOf('<') + 1, allText.indexOf('>'))              
            }
        }
    }
    rawFile.send(null);
    return (content)
}