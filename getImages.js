let imagesLoaded = false;
let lastImageShowed = 9;
let jsonImages = {}
const loading = document.querySelector('.loading')
let animationActive = false;
let imagesField = document.getElementById("imagesField");
let imagesSection = document.getElementById("imagesSection")
let actualPage = 1; 

const displayImages = (begin,end)=>{
	hideLoading();
	for (let img=begin;img<end;img++){
		
		let Htmlimg = document.createElement("img");
		
		Htmlimg.src = jsonImages['collection']['items'][img]['links']['0']['href']
		Htmlimg.style.width = "40%";
		Htmlimg.style.margin = 0;
		Htmlimg.className ="image";
		let imagesField = document.getElementById("imagesField");
		imagesField.appendChild(Htmlimg);
	
    }
    
}

const getImages= async(newSearch)=>{
	
	//delete previous images
	if(newSearch===true){
	
		imagesSection.removeChild(imagesField);
		imagesField = document.createElement("div");
		imagesField.id = "imagesField"
		imagesSection.appendChild(imagesField);
	}
	//data to be send

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
		actualPage = 1

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
	
		 htmlHits= document.getElementById("hits")
		 htmlHits.innerText = "Hits: "+jsonImages['collection']['metadata']['total_hits'];

		 hits.style.display = "block";
		
		 displayImages(0,lastImageShowed);
		 
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



createListOfYearsIn(1950,2021,"startYear");
createListOfYearsIn(1950,2021,"endYear");
document.getElementById("searchButton").addEventListener("click",getImages);
window.addEventListener('scroll',()=>{

	const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
	if(clientHeight+scrollTop>=scrollHeight){

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
