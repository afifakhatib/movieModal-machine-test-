let cl = console.log;

const addModal = document.getElementById('addModal')
const myListCLick = document.getElementById('myListClick')
const backdrop = document.getElementById('backdrop')
const movieModal = document.getElementById('movieModal')
const movieFrom = document.getElementById('movieFrom')
const closeModal = [...document.getElementsByClassName('closeModal')]
const movieContainer = document.getElementById('movieContainer')
const title = document.getElementById('title')
const imageUrl = document.getElementById('imageUrl')
const overview = document.getElementById('overview')
const rating = document.getElementById('rating')
const submitbtn = document.getElementById('submitbtn')
const updatebtn = document.getElementById('updatebtn')
const loader = document.getElementById('loader')

const baseUrl = `https://movie-modal-project-default-rtdb.asia-southeast1.firebasedatabase.app`;
const movieUrl = `${baseUrl}/Movie-modal.json`;

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })


const snackBarmsg = (msg , icon , timer) => {
    swal.fire({
        title : msg,
        icon : icon ,
        timer : timer ,
    })
}

const loadertoggle = () => {
    loader.classList.toggle('d-none')
}

const ondirectToList = () => {
    document.getElementById('myList').scrollIntoView()
}

const hideBtn = () => {
    submitbtn.classList.toggle('d-none')
    updatebtn.classList.toggle('d-none')
}

const objToArr = (obj) => {
    let postArr = [];
    for(let key in obj){
        postArr.push({...obj[key] , id : key})
    }
    return postArr
}

const makeApiCall = (apiUrl , methodName , msgbody) => {

    msgbody = msgbody ? JSON.stringify(msgbody) : null ;

    return fetch(apiUrl ,{
         method : methodName,
         body : msgbody
    })
    .then(res => res.json())
}

loadertoggle()
makeApiCall(movieUrl , 'GET' ,)
 .then(data => {
    cl(data)
    let data1 = objToArr(data)
    cl(data1)
    templating(data1.reverse())
 }).catch(cl)
 .finally(() => loadertoggle())

 const templating = (arr) => {     
    movieContainer.innerHTML =   arr.map(obj => {
        return ` 
        <div class="col-md-4">
        <div class="card mb-4">
            <figure class="movieCard mb-0" id="${obj.id}">
                <div class="movieImg">
                <img src="${obj.imageUrl}" 
                alt="${obj.title}" title="${obj.title}">
                </div>
                <figcaption>
                    <div class="ratingSection">
                        <div class="row">
                            <div class="col-md-9 col-sm-6">
                                <h3>${obj.title}</h3>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <span>${obj.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="overviewSection">
                        <h4 class="mb-2">${obj.title}</h4>
                        <em>OVERVIEW</em>
                        <p data-toggle="tooltip" data-placement="top" title="${obj.overview}">${obj.overview}</p>
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">delete</button>
                    </div>
                    
                </figcaption>
            </figure>
        </div>
    </div>
                 `
       }).join('')
}  

const onEdit = (ele) => {
    let editId = ele.closest('.movieCard').id
    localStorage.setItem('editId',editId)
    let editUrl = `${baseUrl}/Movie-modal/${editId}.json`
    loadertoggle()
    makeApiCall(editUrl,'GET')
     .then(res => {
        cl(res)
        title.value = res.title;
        imageUrl.value = res.imageUrl;
        overview.value = res.overview;
        rating.value = res.rating;
        onAddHideModal()
        hideBtn()
     })
     .catch(cl)
     .finally(()=>loadertoggle())

}

const onUpdateMovie = () => {
    let updateId = localStorage.getItem('editId')
    let updateUrl = `${baseUrl}/Movie-modal/${updateId}.json`
    let updatedObj = {
        title : title.value,
        imageUrl : imageUrl.value,
        overview : overview.value,
        rating : rating.value,
        movieId : updateId
    }
    loadertoggle()
    makeApiCall(updateUrl , 'PATCH',updatedObj)
     .then(res => {
        updatedCard(updatedObj)
        onAddHideModal()
        hideBtn()
        snackBarmsg(`your movie ${updatedObj.title} is updated successfully !!!` , 'success' , 1500)
     })
     .catch((err) => snackBarmsg('err' , 'error' , 15000))
     .finally(() => {
        loadertoggle()
        movieFrom.reset()
     })
}

const updatedCard = (obj) => {
    let card = [...document.getElementById(obj.movieId).children]
    card[0].innerHTML = `<figure class="movieCard mb-0" id="${obj.id}">
    <div class="movieImg">
    <img src="${obj.imageUrl}" 
    alt="${obj.title}" title="${obj.title}">
    </div>`

    card[1].innerHTML = `
    <div class="ratingSection">
    <div class="row">
        <div class="col-md-9 col-sm-6">
            <h3>${obj.title}</h3>
        </div>
        <div class="col-md-3 col-sm-6">
            <span>${obj.rating}</span>
        </div>
    </div>
</div>
<div class="overviewSection">
    <h4 class="mb-2">${obj.title}</h4>
    <em>OVERVIEW</em>
    <p data-toggle="tooltip" data-placement="top" title="${obj.overview}">${obj.overview}</p>
    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
    <button class="btn btn-danger" onclick="onDelete(this)">delete</button>
</div>
                     `
}
   
const onDelete = (ele) => {
    let deleteId = ele.closest('.movieCard').id
    let deleteUrl = `${baseUrl}/Movie-modal/${deleteId}.json`
    loadertoggle()
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            makeApiCall(deleteUrl,'DELETE')
              .then(res => {
                 ele.closest('.movieCard').remove()
           })
           Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          
        }
      })
      .catch(cl)
      .finally(() => loadertoggle())
}

const onAddHideModal = () => {
    movieModal.classList.toggle('active')
    backdrop.classList.toggle('active')
}

// const onhideAll = () => {
//     movieModal.classList.add('active')
//     backdrop.classList.add('active')
// }

const createCard = (obj) => {
    let card = document.createElement('div')
    card.className = 'col-md-4'
    card.id = obj.id
    card.innerHTML = `
    <div class="card mb-4">
    <figure class="movieCard mb-0" id="${obj.id}">
        <div class="movieImg">
        <img src="${obj.imageUrl}" 
        alt="${obj.title}" title="${obj.title}">
        </div>
        <figcaption>
            <div class="ratingSection">
                <div class="row">
                    <div class="col-md-9 col-sm-6">
                        <h3>${obj.title}</h3>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <span>${obj.rating}</span>
                    </div>
                </div>
            </div>
            <div class="overviewSection">
                <h4 class="mb-2">${obj.title}</h4>
                <em>OVERVIEW</em>
                <p data-toggle="tooltip" data-placement="top" title="${obj.overview}">${obj.overview}</p>
                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-danger" onclick="onDelete(this)">delete</button>
            </div>
        </figcaption>
    </figure>
</div>
                     `
             movieContainer.prepend(card);        
}

const onAddMovie = (e) => {
    e.preventDefault()
    let movieObj = {
        title : title.value,
        imageUrl : imageUrl.value,
        overview : overview.value,
        rating : rating.value,
    }
    loadertoggle()
    makeApiCall(movieUrl , 'POST', movieObj)
       .then(res => {
           movieObj.id = res.name;
           createCard(movieObj)
           snackBarmsg(`New movie is added to collection with ${movieObj.title} successfully !!!` , 'success' , 1500)
       })
       .catch((err) => snackBarmsg(`err` ,  'error' , 1500))
       .finally(() => {
        loadertoggle()
          movieFrom.reset()
          onAddHideModal()
       })
}

movieFrom.addEventListener('submit' , onAddMovie)
addModal.addEventListener('click' , onAddHideModal)
closeModal.forEach(hide => {
    hide.addEventListener('click', onAddHideModal)
})
updatebtn.addEventListener('click', onUpdateMovie)
myListCLick.addEventListener('click' , ondirectToList)