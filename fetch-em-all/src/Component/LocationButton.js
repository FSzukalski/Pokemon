function LocationButton(props) {
    return (
        <div key={props.index}>
            <button className="button-contain-location" id={props.areaName} onClick={props.handle} key={props.index} >{props.areaName}</button>
        </div>
    )
}

export default LocationButton