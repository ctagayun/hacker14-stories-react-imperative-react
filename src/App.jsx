/*================================================================
 Imperative React
       The changes in this code will enable us position the cursor 
     in the search textbox. 

       React is inherently declarative. When you implement JSX, you 
     tell React what elements you want to see, not how to create 
     these elements. But there are cases when you dont want everything
     to be declarative. You want to tell react (imperative) how to 
     do things. For example: 
       - read/write access to elements via the DOM API:
           - measuring (read) an element's width or height
           - setting (write) an input field's focus state

      - implementation of more complex animations:
          - setting transitions
          - orchestrating transitions

      - integration of third-party libraries:
          - D3 is a popular imperative chart library
 

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
  //as an array that are needed by the App component.
  
  //This is a custom hook that will store the state in a 
  //local storage. useStorageState which will keep the component's 
  //state in sync with the browser's local storage.

  /*This new custom hook allows us to use it the same way as React's 
   built-in useState Hook. It returns:
      1. state 
      2. and a state updater function
   and accepts an initial state as argument. 
  */
    
  const useStorageState = (key, initialState) => {
     //using the the parameter 'key'. it goes to the local storage
     //to fetch the state if not found uses 'initialState' param and 
     //assigns it to "value" otherwise the state fetched from
     //local storage will be used and assigned to 'value
     //   Note: 1. value is the generic name for state
     //         2. setValue is the name of the function that will 
     //            update the 'value'
     //This code here: 
     //   React.useState(
     //    localStorage.getItem('key') || initialState
     //is simply a logic to determine what state to use.
 
     //Note: to make it generic an resusable change 'search' to 'value'
     // localStorage.getItem('search') || initialState  
     //and change "setSearhTerm" to 'setValue' and 'searchTerm' to 'value'
   
     const [value, setValue] = React.useState(
        localStorage.getItem('key') || initialState 
     );

    //What does useEffect do? by using this hook you tell React that 
    //your component needs to do something after a render.
    //useEffect is a Hook, so you can only call it at the top level 
    //of your component or your own Hooks. You can’t call it inside 
    //loops or conditions. 
    //https://react.dev/reference/react/useEffect#useeffect
   
  React.useEffect(() => {
         console.log('useEffect fired. Displaying value of dependency array ' +
            [value, key]  );

         /* The following code is the first parameter of useEffect - a function.
            This function looks for an item in the localStorage using "key".
            Key is a generic it contains the value "search" of 'search/value' 
            and set 'value' to 'searchTerm' which is the state 
         */
         localStorage.setItem(key, value); 
        },
        [value, key]  //The second parameter of useEffect is a - dependency array
                      //[value]); <-- React.useEffect is triggered when 
                      //when this dependency variable changes. In our
                      //case when a user types into the HTML input field)
        ); //EOF useEffect
    
     //the returned values are returned as an array.
     //to make it generic change [searchTerm, setSearchTerm] to [value , setValue]
     //Again: searchTerm is the state. setSearchTerm is the state updater
     //function.
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
      //Call custom useStorageState hook to assign value to 
      //searchTerm, setSearchTerm
      const [searchTerm, setSearchTerm] =  useStorageState (
        'search', //key
        'React',  //Initial state
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
             isFocused //pass imperatively a dedicated  prop. 
                       //isFocused as an attribute is equivalent to isFocused={true}
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