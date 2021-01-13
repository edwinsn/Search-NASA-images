let imagesLoaded = false;
let lastImageShowed = 9;
let jsonImages = {};
let animationActive = false;
const loading = document.querySelector('.loading');
const imagesSection = document.getElementById("imagesSection");
const searching = document.querySelector('.searching');
const htmlHits= document.getElementById("hits");
let imagesField = document.getElementById("imagesField");
let actualPage = 1; 
let pagesForLoad = 1 ;
let resultsOver = false;

const displayImages = async(begin,end) =>{

	hideLoading();

	let itemsCount = Object.keys(jsonImages['collection']['items']).length;
	if(end > itemsCount){ 

		end = itemsCount;
	
	}
		
for (let img=begin;img<end;img++){
			
	try{
			

		let Htmlimg = document.createElement("img");
		Htmlimg.src = jsonImages['collection']['items'][img]['links']['0']['href']
		Htmlimg.style.width = "40%";
		Htmlimg.style.margin = 0;
		Htmlimg.classList.add="image";
		let imagesField = document.getElementById("imagesField");
		imagesField.appendChild(Htmlimg); 
		
	}
	catch(error){
		try{
			//audio files
			let urlIcon = "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395879-audio_80621.png";
			let Htmlaudiodiv = document.createElement("div")
			let HtmlAudioIcon = document.createElement("img");
			let HtmlAudioLink = document.createElement("a");

			HtmlAudioIcon.src = "https://cdn.icon-icons.com/icons2/1141/PNG/512/1486395879-audio_80621.png"
			HtmlAudioIcon.style.width = "50px";
			Htmlaudiodiv.appendChild(HtmlAudioIcon);
			
			urlTolinks = jsonImages['collection']['items'][img]['href']
			HtmlAudioLink.href = await getAudioLink(urlTolinks);

			let title = jsonImages['collection']['items'][img]['data']['0']['title'];
			HtmlAudioLink.appendChild(document.createTextNode(title))
			Htmlaudiodiv.appendChild(HtmlAudioLink);

			imagesField.appendChild(Htmlaudiodiv);
		
		}catch(error){
			console.log(error);
		}
	}
	
}
if(end===itemsCount){
	showNomoreResults();
}
}

const getImages=  async(newSearch=true)=>{

	//delete previous images
	if(newSearch){
		hideHits();
		showSearching();
		imagesSection.removeChild(imagesField);
		imagesField = document.createElement("div");
		imagesField.id = "imagesField"
		imagesSection.appendChild(imagesField);
		resultsOver = false;
		lastImageShowed = 9;
		
	}
	else{
		pagesForLoad -= 1;
	}

	//collect data to be send

	let url = "https://images-api.nasa.gov/search?";

	let keyWord = "q=" + document.querySelector("#SeachField").value;
	let format="";
	
	if(document.getElementById("OnlyImages").checked){
	  format = "&media_type="+"image";
	}
	else if(document.getElementById("OnlyAudio").checked){
	  format = "&media_type="+"audio";
	}
	if(newSearch){
		actualPage = 1;
	}
	else{
		actualPage += 1;
	}
	yearStarValue= document.getElementById("startYear").value;
	yearEndValue= document.getElementById("endYear").value;

	let yearStar = yearStarValue==="1950"?"":"&year_start="+yearStarValue;
	let yearEnd = yearEndValue==="2021"?"":"&year_end="+yearEndValue;

	//petition to the api
	let endpoint = url+keyWord+format+yearStar+yearEnd+"&page="+actualPage;
	let response = await fetch(endpoint);
	if (response.ok){

		jsonImages = await response.json();
		 totalHits = jsonImages['collection']['metadata']['total_hits'];
		 showHits(totalHits);
		 pagesForLoad = Math.ceil(totalHits/100) ;
		 if(newSearch){
			 hideSearching();
		 }
		 hits.style.display = "block";
		 displayImages(0,9);
		 
	}
	else{
		alert("Error in the petition")
	}
}

const createListOfYearsIn=(begin,end,id)=>{

	let selectionField = document.getElementById(id);
  if (id==="startYear"){
	  for(let i=begin ;i<end;i++){
        option = document.createElement("option");
        option.textContent = i;
        option.value = i;
        selectionField.appendChild(option);
   }
}
  else{

	for(let i=end ;i>begin;i--){
        option = document.createElement("option");
        option.textContent = i;
        option.value = i;
        selectionField.appendChild(option);
   }

    }
}

const showLoading = function(){

  loading.classList.add("show")
  animationActive = true;

}
const hideLoading = function(){

  loading.classList.remove("show");
  animationActive = false;

}

const showMoreImages = function(){
	
	displayImages(lastImageShowed,lastImageShowed+9);
	lastImageShowed += 9 ;
}

const showNomoreResults = function(){

	let endOfResultsLabel = document.createElement("p");
	endOfResultsLabel.classList.add("endOfResults");
	endOfResultsLabel.appendChild(document.createTextNode("End of results"));
	imagesField.appendChild(endOfResultsLabel);
	resultsOver = true;

}

const showSearching = function(){
	searching.style.display = "block";
}
const hideSearching = function(){
	searching.style.display = "none";
}
const showHits = function(totalHits){
	htmlHits.innerText = "Hits: "+totalHits;
}
const hideHits = function(){
	htmlHits.innerText = "";
}
const getAudioLink = async function(url){
	console.log("getting the audio--"+url);
	let response = await fetch(url);
	
	if(response.ok){
		jsonAudioLinks =await response.json();
		console.log("response!--"+jsonAudioLinks['0'])
		return jsonAudioLinks['0'];
	}
	else console.log("Error en la carga del archivo de audio");
	console.log("audio getted")
}
createListOfYearsIn(1950,2021,"startYear");
createListOfYearsIn(1950,2021,"endYear");
document.getElementById("searchButton").addEventListener("click",getImages);
window.addEventListener('scroll',()=>{

	const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
	if(clientHeight+scrollTop>=scrollHeight && !resultsOver){

		showLoading();
		if( lastImageShowed === 99 ){
			getImages(false);
			lastImageShowed = 9;
			
		}
		setTimeout(showMoreImages,300);

	}
	else if(animationActive && clientHeight+scrollTop<=scrollHeight-40 ){
		hideLoading();
	}
})