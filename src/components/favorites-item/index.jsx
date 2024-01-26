import "./styles.css";

const FavoriteItem = (props) => {

    const { id, image, title, removeFavorites } = props;

    return (
        <div key={id} className="favorite-item">
            <div>
                <img src={image} alt="image of recipe" />
            </div>

            <p>{title}</p>

            <button type="button" onClick={removeFavorites}>Remuve from favorites</button>

        </div>


    );
}

export default FavoriteItem;