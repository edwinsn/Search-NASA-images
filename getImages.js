let imagesLoaded = false;
let lastImageShowed = 9;
let jsonImages = {}
let animationActive = false;
const loading = document.querySelector('.loading')
const imagesSection = document.getElementById("imagesSection")
let imagesField = document.getElementById("imagesField");
let actualPage = 1; 
let pagesForLoad = 1 ;
let resultsOver = false;

const displayImages = (begin,end) =>{

	hideLoading();

	let itemsCount = Object.keys(jsonImages['collection']['items']).length;
	if(end > itemsCount){ 

		end = itemsCount;
	
	}
		
for (let img=begin;img<end;img++){
			
	try{
			
		console.log("showing--"+img+"--"+"beging--"+begin+"end--"+end);
		let Htmlimg = document.createElement("img");
		Htmlimg.src = jsonImages['collection']['items'][img]['links']['0']['href']
		Htmlimg.style.width = "40%";
		Htmlimg.style.margin = 0;
		Htmlimg.classList.add="image";
		let imagesField = document.getElementById("imagesField");
		imagesField.appendChild(Htmlimg); 
		
	}
	catch(error){
		//Error: audio files without link
		console.log("Error:"+error);
	}
	
}
if(end===itemsCount){
	showNomoreResults();
}
}

const getImages= async(newSearch=true)=>{

	//delete previous images
	if(newSearch){
	
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
	console.log("in get")
	if (response.ok){

		jsonImages = await response.json();
		 totalHits = jsonImages['collection']['metadata']['total_hits'];
		 htmlHits= document.getElementById("hits")
		 htmlHits.innerText = "Hits: "+totalHits;
		 pagesForLoad = Math.ceil(totalHits/100) ;
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