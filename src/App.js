import React, {useState, useEffect} from 'react';
import './App.css';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import uuid from 'uuid/v4';

// const initialExpense = [
//   {
//     id: uuid(),
//     charge: 'rent',
//     amount: 1000
//   },
//   {
//     id: uuid(),
//     charge: 'car payment',
//     amount: 100
//   },
//   {
//     id: uuid(),
//     charge: 'credit card',
//     amount: 120
//   }
// ]

const initialExpense = localStorage.getItem('expenses') ? 
      JSON.parse(localStorage.getItem('expenses')) : 
      []


function App() {

  // All expenses
  const [expenses, setExpense] = useState(initialExpense);

  // Single expense
  const [charge, setCharge] = useState('');

  // Single amount
  const [amount, setAmount] = useState('');

  //Alert
  const [alert, setAlert] = useState({show: false});

  //Edit
  const [edit, setEdit] = useState(false);

  // Edit Item
  const [id, setId] =useState(0);

  // Using useEffect 
  useEffect(() => {
    console.log('call useEffect');
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses])

  const handleCharge = event => {
    setCharge(event.target.value)
  }

  const handleAmount = event => {
    setAmount(event.target.value)
  }

  const handleAlert = ({type, text}) => {
    setAlert({show: true, type, text});
    setTimeout(() => {
      setAlert({show: false})
    }, 3000)
  }

  const handleSubmit = event => {
    event.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? {...item, charge, amount} : item
        });
        setExpense(tempExpenses);
        setEdit(false);
        handleAlert({type: 'success', text: 'item edited'});
      } else {
        const singleExpense = {
          id: uuid(),
          charge,
          amount
        }
        setExpense([...expenses, singleExpense]);
        handleAlert({type: 'success', text: 'item added'});
      }
      
      setAmount('');
      setCharge('');
    } else {
      handleAlert({type: 'danger', text: `charge can't be empty value and amount value has to be bigger than 0`})
    }
  }

  // Clear All Item
  const clearItems = () => {
    setExpense([]);
    handleAlert({type: 'danger', text: 'all item deleted'});
  }

  // Delete Specific Item
  const handleDelete = id => {
    let tempExpenses = expenses.filter( item => item.id !== id);
    setExpense(tempExpenses);
    handleAlert({type: 'danger', text: 'item deleted'});
  } 

  // Edit Specific Item
  const handleEdit = id => {
    let expenseSelected = expenses.find(item => item.id === id);
    let {charge, amount} = expenseSelected;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  } 

  return (
   <>
     {alert.show && <Alert type={alert.type} text={alert.text} />} 
     <h1>budget calculator</h1>
     <main className='App'>
      <ExpenseForm 
        charge={charge}
        amount={amount}
        handleCharge={handleCharge}
        handleAmount={handleAmount}
        handleSubmit={handleSubmit}
        edit={edit}
      />
      <ExpenseList 
        expenses={expenses} 
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        clearItems={clearItems}  
        />
     </main>
     <h1>
       total spending: <span className='total'>
          $ {expenses.reduce((acc, curr) => {
              return acc + parseInt(curr.amount);
          }, 0)}
       </span>
     </h1>
   </>
  );
}

export default App;
