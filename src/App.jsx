/*================================================================
 Imperative React 
     Review what is useState?
      - When a state gets mutated, the component with the state 
      and all child components will re-render.

   Review what is useEffect?
    - What does useEffect do? by using this hook you tell React that 
     your component needs to do something after render.

=============================================*/

import * as React from 'react';
 
  //Create a custom hook called "useStorageState". We will use two hooks 
  //to create it:
  //    1. useState
  //    2. useEffect 
  //So far this custom hook is just function around useState and useEffect.
  //What's missing is providing an initial state and returning the values
  //that are needed by the App component as an array.
  
  //This is a custom hook that will store the state in a 
  //local storage
  const useStorageState = (key, initialState) => {
     const [value, setValue] = React.useState(
        localStorage.getItem('key') || initialState 
     );

  //What does useEffect do? by using this hook you tell React that 
  //your component needs to do something after a render.
  React.useEffect(() => {
         console.log('useEffect fired. Displaying value of dependency array ' +
            [value, key]  );
         localStorage.setItem(key, value);  //Param 1 of useEffect - a function
        },
        [value, key]  //Param 2 - dependency array
        ); //EOF useEffect
    
     return [value, setValue]; 

  } //EOF create custom hook
  
 const App = () => { 
     
      const stories = [
        {
          title: 'React',
          url: 'https://reactjs.org/',
          author: 'Jordan Walke',
          num_comments: 3,
          points: 4,
          objectID: 0,
        },
        {
          title: 'Redux',
          url: 'https://redux.js.org/',
          author: 'Dan Abramov, Andrew Clark',
          num_comments: 2,
          points: 5,
          objectID: 1,
        },
       ]
      //access the localstorage hook to assign value to 
      //searchTerm, setSearchTerm
      const [searchTerm, setSearchTerm] =  useStorageState (
        'search',
        'React'
        );
      console.log('Value assigned to search term is = ' + searchTerm); 
      console.log('Value assigned tosetSearchTerm is = ' + setSearchTerm); 

      const handleSearch = (event) => {
          setSearchTerm(event.target.value); 
        };

      const searchedStories = stories.filter((story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      /*  <Search search={searchTerm} onSearch={handleSearch} />
          component was renamed InputWithLabel. Two new parameters/props 
          were added: 'id' 'and label' 
            id,
            label,
            type = 'text',
            value, - value will be passed 'searchTerm' the original name of 
                    stateFul value. See line 73
            onInputChange  - will be initialize to handleSearch 
                  (the original name of the callback function)
      */
      return (
        <>
          <h1>My Hacker Stories</h1>
    
           <InputWithLabel
             id="search"
             //label="Search:"
             value={searchTerm} //assign name of stateful value created by call to useState() hook
             isFocused
             onInputChange={handleSearch} //assign name of callback handler
             //text = note we are not passing 'text' prop. Every time the InputWithLabel 
             //component is used without a type prop, the default type will be "text".
             //Here instead of using the label 'prop' we inserted 'Search:'
             //after the closing tag. Between the element tags.
             //You have access to this element via React's children prop
            >
              <strong>Search:</strong>Search: 
             </InputWithLabel>
            
          <hr />
    
          <List list={searchedStories} />
        </>
      );
    }
    
  /* The Search component is just like a form: it has a label "Search:" and 
    and an input text box so we let's rename it to InputWithLabel
      Rename Search component to InputWithLabel and add two 
      props 'id' and 'label'
      1.let's pass dynamic id to make it reusable
      2.let's pass a 'label' prop to make it generic 
      3.rename the prop 'searchTerm' to 'value'  - assign 'searchTerm' to this prop
      4.rename the prop 'onChange' to a more generic term
        'onInputChange' (reminder this prop will be assigned the callback
        'handleSearch')
      4.rename the component too to 'InputWithLabel': 

   1. The old version, function signature becomes:
      const InputWithLabel = ({ id, label, value, onInputChange }) => 
      const InputWithLabel = ({
              id,
              label,
              value,
              type = 'text',
              onInputChange,
            }) => (
              <>
                <label htmlFor={id}>{label}</label>
                &nbsp;
                <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={onInputChange}
                />
              </>
            );   

   2.  The New version below  (replaced label prop with 'children)
     const InputWithLabel = ({ id, value, onInputChange, children }) => 

       In the previous example, instead of using the label prop from 
    before, we inserted the text "Search:" between the component's element's 
    tags. In the InputWithLabel component, you have access to this 
    information via React's children prop now.   
   
       Instead of using the label prop, use the children prop to render 
    everything that has been rendered in between the <InputWithLabel> 
    opening and </InputWithLabel> closing tag. In this case "Search:"
    that we inserted. */

      const InputWithLabel = ({
        id,
       // label,
        value,  //this prop was assigned {searchTerm}
        type = 'text',
        onInputChange, //this prop was assigned {handleSearch} the callback
        isFocused,
        children,
      }) => { 
        const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};
     
    
   const List = ({list}) => (  //<-- destructure objects in the function signature.
    <ul>
       {list.map((item) => (
         <Item key={item.objectID} item={item} />
       ))}
    </ul>
  ); //EOF
     
 
  
  const Item = ({item}) => (   
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );   

    
export default App;

//========================================================== 
//Note on Map:
 //Within the map() method, we have access to each object and its properties.
 
 //useState
 //By using useState, we are telling React that we want to have a 
 //stateful value which changes over time. And whenever this stateful value 
 //changes, the affected components (here: Search component) 
 //will re-render to use it (here: to display the recent value).