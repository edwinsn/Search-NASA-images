let imagesLoaded = false;
let lastImageShowed = 20;
let jsonImages = {}
const loading = document.querySelector('.loading')
animationActive = false;

const displayImages = (begin,end)=>{

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

const getImages= async()=>{
	
	//delete previous images
	let imagesField = document.getElementById("imagesField");
	let imagesSection = document.getElementById("imagesSection")
	imagesSection.removeChild(imagesField);
	
	imagesField = document.createElement("div");
	imagesField.id = "imagesField"
	imagesSection.appendChild(imagesField);

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

	yearStarValue= document.getElementById("startYear").value;
	yearEndValue= document.getElementById("endYear").value;

	let yearStar = yearStarValue==="1950"?"":"&year_start="+yearStarValue;
	let yearEnd = yearEndValue==="2021"?"":"&year_end="+yearEndValue;


	//petition to the api
	let endpoint = url+keyWord+format+yearStar+yearEnd;
  
	let response = await fetch(endpoint);

	if (response.ok){
		
		jsonImages = await response.json();
	
		 htmlHits= document.getElementById("hits")
		 htmlHits.innerText = "Hits: "+jsonImages['collection']['metadata']['total_hits'];

		 hits.style.display = "block";

		 displayImages(0,20);
		 
	}
	else{
		alert("Error in the petition")
	}
}

const showMoreImages = function(){
	displayImages(lastImageShowed,lastImageShowed+20);
	lastImageShowed += 20 ;
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


createListOfYearsIn(1950,2021,"startYear");
createListOfYearsIn(1950,2021,"endYear");
document.getElementById("searchButton").addEventListener("click",getImages);
window.addEventListener('scroll',()=>{

	const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
	if(clientHeight+scrollTop>=scrollHeight-1){
		showLoading();
		setTimeout(showMoreImages,500);

	}
	else if(animationActive && clientHeight+scrollTop<=scrollHeight-40 ){
		hideLoading();
	}

})
