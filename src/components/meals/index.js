import React, { Component } from 'react';
import { Button,Badge,Modal,Container,Row,Col } from 'react-bootstrap';
import { withFirebase } from '../Firebase';
import './index.css'
class Meals extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      show:false,

      instructors: [],
      name:"",
      address:"",
      latitude:0.0,
      longitude:0.0,
      meals:[],
     meal_content:{
       breakfast:[],
       lunch:[],
       dinner:[]
     }
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.meals().on('value', snapshot => {
        const mealsObj =snapshot.val();
    
        const mealList =mealsObj && Object.keys(mealsObj).map(key => ({
          ...mealsObj[key],
          id:key
        }));
      this.setState({
        meals: mealList,
        loading: false,
      });
    });
  }
  validation(){
          
   this.writeUserData()
  
  }
  writeUserData(){
    const{meal_content}=this.state
 
    this.setState({
        loading:true
    })
    this.props.firebase.meals()
    .push({
      label:"Meal plan "+this.state.meals.length,
      ingredients:meal_content
    })
    .then(() => 
    {  
      console.log("Data set")
      alert("Data successfully set")
      this.setState({
        show:false,
        loading:false
      })
    }
    )
    .catch((error)=>{
        console.log(error)
        this.setState({
          show:false,
          loading:false
        })
    });
}
  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  renderTableHeader() {
    let header = ['Quantity','Name','Calories']
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
 }
 handleClose(){
  this.setState({
    show:false
  })
 }
 onChange = event => {
  this.setState({ [event.target.name]: event.target.value });
};
onAddRow=(item)=>{
  //item =0-> breakfast, 1=> lunch, 2=> dinner
  let obj = {
    quantity:"",
    name:"",
    calories:""
  }
  if(item==0){
    let meal_content=this.state.meal_content
    let breakfast = meal_content.breakfast?meal_content.breakfast:[]
    breakfast.push(obj)
    meal_content.breakfast=breakfast
    this.setState({
      meal_content:meal_content
    })
    console.log(meal_content)
  }else if(item==1){
    let meal_content=this.state.meal_content
    let lunch = meal_content.lunch?meal_content.lunch:[]
    lunch.push(obj)
    meal_content.lunch=lunch
    this.setState({
      meal_content:meal_content
    })
  }else if(item==2){
    let meal_content=this.state.meal_content
    let dinner = meal_content.dinner?meal_content.dinner:[]
    dinner.push(obj)
    meal_content.dinner=dinner
    this.setState({
      meal_content:meal_content
    })
  }
}
onChangeText=(event,index,type,key)=>{
  console.log(event.target.name)
  console.log(index)
  let meal_content = this.state.meal_content
 let ingredients=  meal_content[type]
 let obj = ingredients[index]
 let new_obj = Object.assign({}, obj, { [key]: event.target.value })

 meal_content[type][index]=new_obj
 console.log(meal_content)
 this.setState({
     meal_content:meal_content
 })

}
 render() {
    const { users, loading,meal_content } = this.state;
    return (
      <div style={{flexDirection:'column',marginLeft:20}}>
        <h1>Meals</h1>
        <Button variant="primary" style={{marginLeft:20}} onClick={()=>this.setState({
          show:true
        })}>Add a Meal Plan</Button>{' '}
        {loading && <div>Loading ...</div>}
        {
          this.state.meals && this.state.meals.map((meal,index)=>{
            return(
              <div key={index}>
                <h1>{meal.label}</h1>
                <label>Breakfast</label>
                <table id='students'>
                <tbody>
                    <tr>{this.renderTableHeader()}</tr>
                    {meal.ingredients && meal.ingredients.breakfast?this.renderTableData(meal.ingredients.breakfast):null}
                </tbody>
              </table>
              <label>Lunch</label>
                <table id='students'>
                <tbody>
                    <tr>{this.renderTableHeader()}</tr>
                    {meal.ingredients && meal.ingredients.lunch?this.renderTableData(meal.ingredients.lunch):null}
                </tbody>
                </table>
                <label>Dinner</label>
                <table id='students'>
                <tbody>
                    <tr>{this.renderTableHeader()}</tr>
                    {meal.ingredients && meal.ingredients.dinner?this.renderTableData(meal.ingredients.dinner):null}
                </tbody>
                </table>
             </div>
            )   
          })
        }
        
        <Modal show={this.state.show} onHide={()=>this.handleClose()} >
        <Modal.Header closeButton>
          <Modal.Title>Add a Meal Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <Container style={{alignItems:'center'}}>
       

         <h3>Breakfast</h3>
         <table id='students'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>               
                  {
                    meal_content.breakfast && meal_content.breakfast.map((source,index)=>{
                      return(
                    <tr>
                      <td>
                        <input 
                          name="quantity"
                          value={source.quantity}
                          onChange={(event)=>this.onChangeText(event,index,"breakfast","quantity")}
                          type="text"
                          placeholder="Quantity"
                        />
                        </td>
                        <td>
                          <input 
                          name="name"
                          value={source.name}
                          onChange={(text)=>this.onChangeText(text,index,"breakfast","name")}
                          type="text"
                          placeholder="Name"
                        />
                        </td>
                        <td>
                          <input 
                          name="calories"
                          value={source.calories}
                          onChange={(text)=>this.onChangeText(text,index,"breakfast","calories")}
                          type="number"
                          placeholder="0.0"
                        />
                        </td>
                     </tr>
                      )
                    })
                  }
               </tbody>
        </table>
         <Button variant="primary" size="lg" block onClick={()=>this.onAddRow(0)} style={{marginVertical:10}}>
          Add a Breakfast item
        </Button>
        <h3>Lunch</h3>
         <table id='students'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>               
                  {
                    meal_content.lunch && meal_content.lunch.map((source,index)=>{
                      return(
                    <tr>
                      <td>
                        <input 
                          name="quantity"
                          value={source.quantity}
                          onChange={(event)=>this.onChangeText(event,index,"lunch","quantity")}
                          type="text"
                          placeholder="Quantity"
                        />
                        </td>
                        <td>
                          <input 
                          name="name"
                          value={source.name}
                          onChange={(text)=>this.onChangeText(text,index,"lunch","name")}
                          type="text"
                          placeholder="Name"
                        />
                        </td>
                        <td>
                          <input 
                          name="calories"
                          value={source.calories}
                          onChange={(text)=>this.onChangeText(text,index,"lunch","calories")}
                          type="number"
                          placeholder="0.0"
                        />
                        </td>
                     </tr>
                      )
                    })
                  }
               </tbody>
        </table>
         <Button variant="primary" size="lg" block onClick={()=>this.onAddRow(1)} style={{marginVertical:10}}>
          Add a Lunch item
        </Button>
        <h3>Dinner</h3>
         <table id='students'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>               
                  {
                    meal_content.dinner && meal_content.dinner.map((source,index)=>{
                      return(
                    <tr>
                      <td>
                        <input 
                          name="quantity"
                          value={source.quantity}
                          onChange={(event)=>this.onChangeText(event,index,"dinner","quantity")}
                          type="text"
                          placeholder="Quantity"
                        />
                        </td>
                        <td>
                          <input 
                          name="name"
                          value={source.name}
                          onChange={(text)=>this.onChangeText(text,index,"dinner","name")}
                          type="text"
                          placeholder="Name"
                        />
                        </td>
                        <td>
                          <input 
                          name="calories"
                          value={source.calories}
                          onChange={(text)=>this.onChangeText(text,index,"dinner","calories")}
                          type="number"
                          placeholder="0.0"
                        />
                        </td>
                     </tr>
                      )
                    })
                  }
               </tbody>
        </table>
         <Button variant="primary" size="lg" block onClick={()=>this.onAddRow(2)} style={{marginVertical:10}}>
          Add a Dinner item
        </Button>
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>this.handleClose()}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>this.validation()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  }
  renderTableData(ar_ingredients) {
 console.log(ar_ingredients)
    return ar_ingredients && ar_ingredients.map((meal, index) => {
       const { quantity,name,calories } = meal //destructuring
    
       return (
          <tr key={index}>
             <td>{quantity}</td>
             <td>{name}</td>
             <td>{calories}</td>
          </tr>
       )
    })
 }
}



export default withFirebase(Meals);