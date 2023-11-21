import { useEffect, useState } from 'react'
import React from 'react'
import './App.css'
import axios from 'axios'
import LocationButton from './Component/LocationButton'
import Encounter from './Component/Encounter'

function App() {
  const [randomPokemonUrl, setRandomPokemonUrl] = useState([])
  const [encounters, setEncounters] = useState([])
  const [fight, setFight] = useState(false)
  const [locations, setLocations] = useState([])
  const [areas, setAreas] = useState([])
  const [areasName, setAreasName] = useState([])
  const [randomPokemon, setRandomPokemon] = useState([])
  const [encounteredPokemon, setEncounteredPokemon] = useState([])
  const [usersPokemonUrl, setUsersPokemonUrl] = useState([
    'https://pokeapi.co/api/v2/pokemon/lucario',
    'https://pokeapi.co/api/v2/pokemon/raichu',
    'https://pokeapi.co/api/v2/pokemon/magikarp',
  ])
  const [usersPokemon, setUsersPokemon] = useState([])

  useEffect(() => {
    async function fetchLocations() {
      const response = await axios.get('https://pokeapi.co/api/v2/location?offset=20&limit=20')
      const locationUrls = response.data.results.map((location) => location.url)
      setLocations(locationUrls)
    }
    fetchLocations()
  }, [])

  useEffect(() => {
    async function fetchareas() {
      const response = locations.map((location) => axios.get(location))
      const all = await Promise.all(response)
      const response2 = all.map((area) => area.data.areas[0].url)
      const areasURL = await Promise.all(response2)
      setAreas(areasURL)
    }
    fetchareas()
  }, [locations])

  useEffect(() => {
    async function fetchEncounterAndName() {
      const response = areas.map((area) => axios.get(area))
      const all = await Promise.all(response)
      const response2 = all.map((areaName) => areaName.data.location.name)
      const areasNamesArr = await Promise.all(response2)
      const response3 = all.map((pokemon) => pokemon.data)
      const possibleEncounters = await Promise.all(response3)
      setEncounters(possibleEncounters)
      setAreasName(areasNamesArr)
    }
    fetchEncounterAndName()
  }, [areas])

  useEffect(() => {
    async function fetchPokemon() {
      if (randomPokemon.pokemon) {
        setRandomPokemonUrl(randomPokemon.pokemon.url)
        const RandomPokemonData = await axios.get(randomPokemon.pokemon.url)
        setEncounteredPokemon(RandomPokemonData)
        setFight(true)
      }
    }
    fetchPokemon()
  }, [randomPokemon])

  function handleClick(event) {

    const chosenEncounter = encounters.find((encounter) => encounter.location.name === event.target.id)
    const randomPokemonObject =
      chosenEncounter.pokemon_encounters[Math.floor(Math.random() * chosenEncounter.pokemon_encounters.length)]
    setRandomPokemon(randomPokemonObject)

  }

  useEffect(() => {
    async function fetchUsersPokemon() {
      const response = usersPokemonUrl.map((pokemon) => axios.get(pokemon))
      const usersPokemonObject = await Promise.all(response)
      setUsersPokemon(usersPokemonObject)

    }
    fetchUsersPokemon()
  }, [usersPokemonUrl])


  //useEffect(() => { console.log(encounteredPokemon) }, [encounteredPokemon])
  return (<div className="console">
    <div className="screen">
      {<div className='screen1' key="main">
        {fight ? (<Encounter usersPokemonUrl={usersPokemonUrl} setUsersPokemonUrl={setUsersPokemonUrl} setFight={setFight} usersPokemon={usersPokemon} randomPokemonUrl={randomPokemonUrl} encounteredPokemon={encounteredPokemon} />

        ) : (<div className='container'>{areasName.map((area, index) => (
          <LocationButton index={index} key={index} areaName={area} handle={handleClick} />
        ))}
        </div>
        )}
      </div>}
    </div>
    {/* <div className="joystick">
    <div className="joystick-dot"></div>
  </div> */}
  </div>

  )
}

export default App
