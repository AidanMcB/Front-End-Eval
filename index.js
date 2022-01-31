document.addEventListener('DOMContentLoaded', function() {
    
    const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1'
    const artworkGrid = document.querySelector('.artwork-table');

    submitForm = (e) => {
        e.preventDefault();
        while (artworkGrid.firstChild) {
            artworkGrid.firstChild.remove()
        }
        let firstFiveIds = [];
        let searchText = document.querySelector('.input').value;
        searchText = searchText.split(' ').join('');

        let century = document.querySelector('.centuries').value;
        let centuryEnd = century ? (parseInt(century) + 100) : '';
        let isPublicDomain = document.querySelector('.check-box').checked;
        fetch(`${baseURL}/search?dateBegin=${century}&dateEnd=${centuryEnd}&isPublicDomain=${isPublicDomain}&q=${searchText}`)
            .then( res => res.json())
            .then(artworks => {
                if(artworks.objectIDs?.length > 0){
                    firstFiveIds = artworks.objectIDs.slice(0, 5);
                    firstFiveIds.forEach(id => {
                        getIndividualObject(id);
                    });
                }   
            })
    }

    getIndividualObject = async (objectID) => {
        await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
            .then(res => res.json())
            .then(object => {
                let artwork = {
                    title: object.title,
                    picture: object.primaryImageSmall,
                    artistName: object.artistDisplayName,
                    department: object.department
                }
                addArtworkToGrid(artwork);
            })
    }

    addArtworkToGrid = (artwork) => {
        let title = document.createElement('p');
            title.classList.add('card-title');
            title.innerText = artwork.title;
        let img = document.createElement('img');
            img.classList.add('card-img');
            img.src = artwork.picture;
        let artistName = document.createElement('p');
            artistName.classList.add('card-artist');
            artistName.innerText = artwork?.artistName?.length > 0 ? `- ${artwork.artistName} -` : '';          
        let department = document.createElement('p');
            department.classList.add('card-department');
            department.innerText = artwork.department;
        let cardInfo = document.createElement('div');
            cardInfo.classList.add('card-info');
            cardInfo.append(artistName, department);

        let artworkCard = document.createElement('div');
            artworkCard.classList.add('artwork-card');
            artworkCard.append(title, img, cardInfo);

        artworkGrid.appendChild(artworkCard);
    }

    listOfCenturies = () => {
        let centuryOptions = document.querySelector(".centuries");
        let noCenturyOption = document.createElement('option');
        noCenturyOption.text = '-';
        noCenturyOption.value = '';
        centuryOptions.add(noCenturyOption);
        for(let i = -2000; i <= 2100; i+=100){
            let option = document.createElement('option');
            option.text = i < 0 ? `${i*-1}s B.C.` : `${i}s A.D.`;
            option.value = i;
            centuryOptions.add(option)
        }
    }

    listOfCenturies();

})