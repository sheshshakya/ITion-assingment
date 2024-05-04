import React, { useState, useEffect } from 'react'
import moviesList from '../utils/utils.json'
import '../components.css'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const Home = () => {
  const [movies, setMovies] = useState(moviesList);
  const [typedCountry, setTypedCountry] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [originalMovies, setOriginalMovies] = useState([]);
  const getUniqueValues = (array) => {
    return Array.from(new Set(array));
  };

  const [uniqueCountries, setUniqueCountries] = useState(getUniqueValues(movies.flatMap(movie => movie.moviecountries)));
  const [uniqueGenres, setUniqueGenres] = useState(getUniqueValues(movies.flatMap(movie => movie.moviegenres)));
  const [uniqueLanguages, setUniqueLanguages] = useState(getUniqueValues(movies.flatMap(movie => movie.movielanguages)));

  useEffect(() => {
    setOriginalMovies([...movies]);
  }, []);

  useEffect(() => {
    let updatedMovies = [...originalMovies];

    if (selectedGenres.length || selectedLanguages.length || selectedCountries.length || searchQuery) {
      updatedMovies.forEach(movie => {
        movie.matchCount = 0;
        if (selectedGenres.length) {
          movie.matchCount += selectedGenres.filter(genre => movie.moviegenres.includes(genre)).length;
        }
        if (selectedLanguages.length) {
          movie.matchCount += selectedLanguages.filter(language => movie.movielanguages.includes(language)).length;
        }
        if (selectedCountries.length) {
          movie.matchCount += selectedCountries.filter(country => movie.moviecountries.includes(country)).length;
        }
        if (searchQuery) {
          const regex = new RegExp(searchQuery, 'gi');
          if (movie.movietitle.match(regex)) {
            movie.matchCount += 1;
          }
        }
      });

      updatedMovies = updatedMovies.filter(movie => {
        return (
          (!selectedGenres.length || selectedGenres.every(genre => movie.moviegenres.includes(genre))) &&
          (!selectedLanguages.length || selectedLanguages.every(language => movie.movielanguages.includes(language))) &&
          (!selectedCountries.length || selectedCountries.every(country => movie.moviecountries.includes(country))) &&
          (!searchQuery || movie.matchCount > 0)
        );
      });

      updatedMovies.sort((a, b) => {
        if (a.matchCount !== b.matchCount) {
          return b.matchCount - a.matchCount;
        } else {
          return a.movietitle.localeCompare(b.movietitle);
        }
      });
    }

    setMovies(updatedMovies);
  }, [selectedGenres, selectedLanguages, selectedCountries, searchQuery, originalMovies]);

  const handleGenreChange = (event) => {
    const genre = event.target.name;
    setSelectedGenres(prevState => {
      if (prevState.includes(genre)) {
        return prevState.filter(item => item !== genre);
      } else {
        return [...prevState, genre];
      }
    });
  };

  const handleLanguageChange = (event) => {
    const language = event.target.name;
    setSelectedLanguages(prevState => {
      if (prevState.includes(language)) {
        return prevState.filter(item => item !== language);
      } else {
        return [...prevState, language];
      }
    });
  };

  const handleCountryChange = (event) => {
    const country = event.target.name;
    setSelectedCountries(prevState => {
      if (prevState.includes(country)) {
        return prevState.filter(item => item !== country);
      } else {
        return [...prevState, country];
      }
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  })


  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(null);


  return (
    <>
      <div className='main_container'>
        {!isMobileView ? <>
          <div className='filterContainer'>
            <div className="filterBox">
              <div className="filterHeader"><h1>Apply Filters</h1></div>
              <div className="filterBody">
                <div className="genre">
                  <h2>Genre</h2>
                  <div className="genreList">
                    {uniqueGenres.map((genre, index) => (
                      <div key={index} className="genreItem">
                        <input type="checkbox" name={genre} id={genre} onChange={handleGenreChange} checked={selectedGenres.includes(genre)} />
                        <label htmlFor={genre}>{genre}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="language">
                  <h2>Language</h2>
                  <div className="languageList">
                    {uniqueLanguages.map((language, index) => (
                      <div key={index} className="languageItem">
                        <input type="checkbox" name={language} id={language} onChange={handleLanguageChange} checked={selectedLanguages.includes(language)} />
                        <label htmlFor={language}>{language}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="country">
                  {typedCountry.length > 0 && <div className='countryList' >
                    {uniqueCountries.filter(country => country.toLowerCase().includes(typedCountry.toLowerCase())).map((country, index) => (
                      <div key={index} className="countryItem">
                        <input type="checkbox" name={country} id={country} onChange={handleCountryChange} checked={selectedCountries.includes(country)} />
                        <label htmlFor={country}>{country}</label>
                      </div>
                    ))}
                  </div>}
                  <h2>Country</h2>
                  <input type="text" placeholder='Search your country...' onChange={(e) => setTypedCountry(e.target.value)} value={typedCountry} />
                </div>
              </div>
            </div>
          </div>
          <div className='right' >
            <div className='searchBoxContainer'>
              <div className='searchBox'>
                <div className="searchIcon">
                  <SearchIcon sx={{ color: "white", width: "50%", height: "50%" }} />
                </div>
                <div className="searchInput">
                  <input type="text" placeholder='Search your movie...' onChange={handleSearch} value={searchQuery} />
                </div>
              </div>
            </div>
            <div className="displayArea">
              {movies.map((movie, index) => (
                <div className='movieCard' key={index} >
                  <div className='movieImageSection' >
                    <img src={movie.moviemainphotos[0]} alt={movie.title} className='movieImage' />
                  </div>
                  <div className="movieDetailsSection">
                    <h2>
                      {movie.movietitle.length > 17 ?
                        `${movie.movietitle.substring(0, 17)}...` :
                        movie.movietitle
                      }
                    </h2>
                    <h3> <i>  {movie.moviegenres.join(', ')}</i></h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </> : <>
          <div className="burgerMenu">
            {isBurgerMenuOpen ? <MenuOpenIcon sx={{ color: "white", width: "50%", height: "50%" }} onClick={() => setIsBurgerMenuOpen(false)} /> : <MenuIcon sx={{ color: "white", width: "50%", height: "50%" }} onClick={() => setIsBurgerMenuOpen(true)} />}
          </div>
          {/* {isBurgerMenuOpen && */}
            <div className={` ${isBurgerMenuOpen ? 'slideIn filterDrawer ' : isBurgerMenuOpen === false ? 'slideOut filterDrawerClosed' : 'filterDrawerHidden' }`}>
              <div className="filterHeader"><h2>Apply Filters</h2></div>
              <div className="filterBody">
                <div className="genre">
                  <h3>Genre</h3>
                  <div className="genreList">
                    {uniqueGenres.map((genre, index) => (
                      <div key={index} className="genreItem">
                        <input type="checkbox" name={genre} id={genre} onChange={handleGenreChange} checked={selectedGenres.includes(genre)} />
                        <label htmlFor={genre}>{genre}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="language">
                  <h3>Language</h3>
                  <div className="languageList">
                    {uniqueLanguages.map((language, index) => (
                      <div key={index} className="languageItem">
                        <input type="checkbox" name={language} id={language} onChange={handleLanguageChange} checked={selectedLanguages.includes(language)} />
                        <label htmlFor={language}>{language}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="country">
                  {typedCountry.length > 0 && <div className='countryList' >
                    {uniqueCountries.filter(country => country.toLowerCase().includes(typedCountry.toLowerCase())).map((country, index) => (
                      <div key={index} className="countryItem">
                        <input type="checkbox" name={country} id={country} onChange={handleCountryChange} checked={selectedCountries.includes(country)} />
                        <label htmlFor={country}>{country}</label>
                      </div>
                    ))}
                  </div>}
                  <h3>Country</h3>
                  <input type="text" placeholder='Search your country...' onChange={(e) => setTypedCountry(e.target.value)} value={typedCountry} />
                </div>
              </div>
            </div>
          {/* // } */}

          <div className='right' >
            <div className='searchBoxContainer'>
              <div className='searchBox'>
                <div className="searchIcon">
                  <SearchIcon sx={{ color: "white", width: "50%", height: "50%" }} />
                </div>
                <div className="searchInput">
                  <input type="text" placeholder='Search your movie...' onChange={handleSearch} value={searchQuery} />
                </div>
              </div>
            </div>
            <div className="displayArea">
              {movies.map((movie, index) => (
                <div className='movieCard' key={index} >
                  <div className='movieImageSection' >
                    <img src={movie.moviemainphotos[0]} alt={movie.title} className='movieImage' />
                  </div>
                  <div className="movieDetailsSection">
                    <h2>
                      {movie.movietitle.length > 17 ?
                        `${movie.movietitle.substring(0, 17)}...` :
                        movie.movietitle
                      }
                    </h2>
                    <h3> <i>  {movie.moviegenres.join(', ')}</i></h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}
      </div>
    </>
  )
}

export default Home;
