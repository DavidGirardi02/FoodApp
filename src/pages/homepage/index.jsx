import { useEffect, useReducer, useState } from "react";
import Search from "../../components/search";
import "./styles.css";
import ReceipeItem from "../../components/receipes-item";
import FavoriteItem from "../../components/favorites-item";

const dummyData = 'dummydata';

const reducer = (state,action)=>{
    
    switch(action.type){
        case 'filterFavorites':
            console.log(action);
            return {
                ...state,
                filteredValue : action.value,
            }

        default:
            return state;
    }

}

const initialState = {
    filteredValue : ''
}

const Homepage = ()=>{
    //loading state

    const [loadingState, setLoadingState] = useState(false);

    //save result

    const [recipes, setRecipes] = useState([]);

    //favorites data state

    const [favorites, setFavorites] = useState([]);

    //state for api

    const [apiCalledSuccess, setApiCalledSuccess] = useState(false);

    //use reducer funciotnality

    const [filteredState, dispatch] = useReducer(reducer, initialState);

    const getDataFromSearchComponent = (getData)=>{
       
        //set state true

        setLoadingState(true);

         //calling Api

        async function getReceipes(){

            const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=e32bd4c748b148638c0819fd810f07ed&query=${getData}`);

            const result = await apiResponse.json();
            const {results} = result;

            if(results && results.length > 0){
                //loading state false
                setLoadingState(false);
                //set recipes state
                setRecipes(results);
                //set api state
                setApiCalledSuccess(true);
            }
        }

        getReceipes();
    };

    const addToFavorites = (getCurrentRecipeItem)=>{
        let cpyFavorites = [...favorites];

        const index = cpyFavorites.findIndex(item=> item.id === getCurrentRecipeItem.id);
        if(index === -1){
            cpyFavorites.push(getCurrentRecipeItem);
            setFavorites(cpyFavorites);
            //save Favorites in local storage
            localStorage.setItem('favorites', JSON.stringify(cpyFavorites));
        } else{
            alert('item is already present in favorites');
        }
        
    };

    const removeFavorites = (getCurrentId)=>{
        let cpyFavorites = [...favorites];
        cpyFavorites = cpyFavorites.filter(item => item.id !== getCurrentId);

        setFavorites(cpyFavorites);
        localStorage.setItem('favorites', JSON.stringify(cpyFavorites));
    };

    useEffect(()=>{
        const extractFavorites = JSON.parse(localStorage.getItem('favorites'));
        setFavorites(extractFavorites);
    },[]);

    //filter favorites

    const filteredFavoritesItem = favorites.filter(item=> item.title.toLowerCase().includes(filteredState.filteredValue));


    return (
        <div className="homepage">
            <Search getDataFromSearchComponent={getDataFromSearchComponent} dummyData={dummyData} apiCalledSuccess={apiCalledSuccess} setApiCalledSuccess={setApiCalledSuccess}></Search>
            
            <div className="favorites-wrapper">
                <h1 className="favorites-title">Favorties</h1>

                <div className="search-favorites">
                    <input onChange={(event)=> dispatch({type: 'filterFavorites', value: event.target.value})} value={filteredState.filteredValue} name="favorites" placeholder="search"/>
                </div>

                <div className="favorites">
                    {
                        filteredFavoritesItem && filteredFavoritesItem.length > 0 ?
                        filteredFavoritesItem.map((item)=> <FavoriteItem id={item.id} removeFavorites={()=>removeFavorites(item.id)} image={item.image} title={item.title}/>):null
                    }
                </div>
            </div>

            {
                loadingState && <div className="loading">Loading recipes!</div>
            } 

            <div className="items">
                {
                    recipes &&recipes.length>0
                    ? recipes.map((item)=> <ReceipeItem id={item.id} addToFavorites={()=>addToFavorites(item)} image={item.image} title={item.title}/>):null
                }
            </div>

        </div>

    );
}

export default Homepage;