import React from 'react'
import { useState, useEffect } from 'react'
import myMusic from './myMusic.mp3'
function Encounter(props) {
  console.log(props)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [chosen, setChosen] = useState(false)
  const [choosenPokemon, setChoosenPokemon] = useState({})
  const [startFightButtonDisabled, setStartFightButtonDisabled] = useState(false)
  const [selectDisabled, setSelectDisabled] = useState(false)
  const [enemyPokemonStats, setEnemyPokemonStats] = useState({
    url: props.randomPokemonUrl,
    name: props.encounteredPokemon.data.name,
    attack: props.encounteredPokemon.data.stats[1].base_stat,
    defence: props.encounteredPokemon.data.stats[2].base_stat,
    hp: props.encounteredPokemon.data.stats[0].base_stat,
    image: props.encounteredPokemon.data.sprites.front_default,
    maxHp: props.encounteredPokemon.data.stats[0].base_stat,
  })

  function battle() {
    if (choosenPokemon.hp >= 0 && enemyPokemonStats.hp >= 0) {
      setTimeout(function () {
        enemyPokemonStats.hp =
          enemyPokemonStats.hp -
          Math.floor(
            ((((2 / 5 + 2) * choosenPokemon.attack * 60) / enemyPokemonStats.defence / 50 + 2) *
              (217 + Math.floor(Math.random() * 39))) /
              255
          )

        setEnemyPokemonStats({ ...enemyPokemonStats })
        if (enemyPokemonStats.hp <= 0) {
          return console.log('win')
        }
      }, 1000)
      setTimeout(function () {
        choosenPokemon.hp =
          choosenPokemon.hp -
          Math.floor(
            ((((2 / 5 + 2) * choosenPokemon.attack * 60) / choosenPokemon.defence / 50 + 2) *
              (217 + Math.floor(Math.random() * 39))) /
              255
          )

        setChoosenPokemon({ ...choosenPokemon })
        if (choosenPokemon.hp <= 0) {
          return console.log('Loose')
        }
      }, 2000)
    }

    setTimeout(function () {
      battle()
    }, 2000)
  }

  function handleBattle() {
    if (enemyPokemonStats.hp <= 0) {
      props.setUsersPokemonUrl([...props.usersPokemonUrl, props.randomPokemonUrl])
      props.setFight(false)
      return
    } else if (choosenPokemon.hp <= 0) {
      props.setFight(false)
      return
    }
  }
  const mouseOverHandler = (event) => {
    const pokemonName = event.target.id
    const pokemon = props.usersPokemon.find((pokemon) => pokemon.data.name === pokemonName)
    setSelectedPokemon(pokemon)
  }

  function handleClick() {
    setStartFightButtonDisabled(true)
    setSelectDisabled(true)
    battle()
  }

  function choosingHandler(event) {
    const findChoosenPokemon = props.usersPokemon.find((element) => element.data.name === event.target.id)
    setChoosenPokemon({
      name: findChoosenPokemon.data.name,
      attack: findChoosenPokemon.data.stats[1].base_stat,
      defence: findChoosenPokemon.data.stats[2].base_stat,
      hp: findChoosenPokemon.data.stats[0].base_stat,
      image: findChoosenPokemon.data.sprites.back_default,
      maxHp: findChoosenPokemon.data.stats[0].base_stat,
    })
    setChosen(true)
  }
  return (
    <div className="battleScreen">
      {chosen ? (
        <div>
          <audio autoPlay>
            <source src={myMusic} type="audio/mpeg" />
          </audio>
          <div className="battleInfo">
            <div id="oponentID">
              <img className="enemyPokemonImg" src={enemyPokemonStats.image}></img>
              <div className="enemyPokemonCard">
                <div className="pokemonName">{enemyPokemonStats.name}</div>
                <div className="pokemonHp">
                  {enemyPokemonStats.hp}/{enemyPokemonStats.maxHp}
                </div>
              </div>
            </div>
            <div id="userPokemon">
              <img className="userPokemonImg" src={choosenPokemon.image} />
              <div className="userPokemonCard">
                <div>{choosenPokemon.name}</div>
                <div>
                  {choosenPokemon.hp}/{choosenPokemon.maxHp}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleClick} id="startFight" disabled={startFightButtonDisabled}>
            Start Fight
          </button>
          <button id='startFight' onClick={handleBattle}>Go back</button>
        </div>
      ) : (
        <div className="encounter-container">
          {selectedPokemon && (
            <div className="pokemon-and-button">
              <div className="player-vs-enemy">
                <div className="pokemon-enemy">
                  <img src={enemyPokemonStats.image}></img>
                  <div>Name: {enemyPokemonStats.name}</div>
                  <div>HP: {enemyPokemonStats.hp}</div>
                  <div>Attack: {enemyPokemonStats.attack}</div>
                  <div>Defense: {enemyPokemonStats.defence}</div>
                </div>
                <div className="versus">
                  <img
                    width="100"
                    height="50"
                    className="versus-img"
                    src="https://www.pngall.com/wp-content/uploads/5/Combat-Versus-Transparent.png"
                  />
                  <button className="choose-pokeomon-fight" id={selectedPokemon.data.name} onClick={choosingHandler}>
                    Choose {selectedPokemon.data.name}!
                  </button>
                </div>
                <div className="pokemon-info">
                  <img src={selectedPokemon.data.sprites.front_default} />
                  <div>Name: {selectedPokemon.data.name}</div>
                  <div>HP: {selectedPokemon.data.stats[0].base_stat}</div>
                  <div>Attack: {selectedPokemon.data.stats[1].base_stat}</div>
                  <div>Defense: {selectedPokemon.data.stats[2].base_stat}</div>
                </div>
              </div>
            </div>
          )}
          <div className="pokemon-list-and-name">
            <div className="choose-your-pokemon">Choose your POKEMON!</div>
            <div className="pokemon-list">
              {props.usersPokemon.map((pokemon, index) => {
                return (
                  <div key={index} id={pokemon.data.name} className="pokemon-item" onClick={mouseOverHandler}>
                    <img src={pokemon.data.sprites.front_default} id={pokemon.data.name} />
                    <div id={pokemon.data.name}>
                      <center>
                        <h3>{pokemon.data.name}</h3>
                      </center>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Encounter
