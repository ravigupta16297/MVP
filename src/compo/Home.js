import React, { useEffect, useState } from 'react';

const Home = () => {
  const [result, setResult] = useState([]);
  const [val, setVal] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('')
  
  let debounceTimer;
  const fetchData = async () => {
    const res = await fetch('./branch1.json');
    const res2 = await fetch('./branch2.json');
    const res3 = await fetch('./branch3.json');
    const data = await res.json();
    const data2 = await res2.json();
    const data3 = await res3.json();

    const mergedData = [...data.products, ...data2.products, ...data3.products];
    setResult(mergedData);
    localStorage.setItem('result', JSON.stringify(mergedData));
  };
// fetching the data here
  useEffect(() => {
    const cachedRes = localStorage.getItem('result');
    if (cachedRes) {
      setResult(JSON.parse(cachedRes));
    } else {
      fetchData();
    }
  }, []);
//checking to see what values are being repeated and then adding their revenue into one 
  useEffect(() => {
    let ar = [];
    let obj = {};
    let ctr = 0;
    let sum = 0;
   const handle=()=> {
    result.forEach((ele, i) => {
      if (!obj[ele.name]) {
        let rev = Math.ceil(ele.sold * ele.unitPrice);
        ar[ctr] = { name: ele.name, revenue: rev };
        obj[ele.name] = 1;
        ctr++;
        sum += rev;
      } else {
        let rev = Math.ceil(ele.sold * ele.unitPrice);
        sum += rev;
        let ind = ar.findIndex((item) => item.name === ele.name);
        ar[ind].revenue = rev + ar[ind].revenue;
        obj[ele.name] += 1;
      }
    });
    ar.sort((a, b) => {
      let name1 = a.name.toUpperCase();
      let name2 = b.name.toUpperCase();
      if (name1 > name2)
        return 1;
      else if (name2 > name1)
        return -1;
      else return 0;
    });

if(search.length !== 0)
{
    let pri = ar.filter((ele) => {
      return ele.name.toLowerCase().includes(search.toLowerCase()) 
    })
    setVal(pri);
    setTotal(pri.reduce((acc, curr) => {
      acc += curr.revenue;
      return acc;
    }, 0))
    return () => clearTimeout(debounceTimer);
  }
  else {
    
    setTotal(sum);
    setVal([...ar]);
  }
  }
    if (search.length !== 0) {
      const debouncedSearch = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handle, 500); 
      };
      debouncedSearch();
      return () => clearTimeout(debounceTimer);
    }
    else{
      handle();
    }
  }, [result, search]);

  return (
    <>
      <h1>Item-List : Ravi Gupta</h1>
      <div className='container'>
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value) }}
          placeholder='Enter value to search' />
        <table>
          <tbody>
            <tr>
              <th>Product-Name</th>
              <th>Revenue</th>
            </tr>
            {val.map((ele, id) => (
              <tr key={id}>
                <td>{ele.name}</td>
                <td>{ele.revenue}</td>
              </tr>
            ))}
            <tr>
              <th>Total Revenue:</th>
              <td>
                <strong>{total}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
