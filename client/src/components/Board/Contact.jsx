import React from 'react'
import { useState, useEffect } from 'react';
import axios from '../../plugins/axios';
import useStore from '../../store/store';
import { Link } from 'react-router-dom';
import Styled from 'styled-components';

export default function ContactMe() {
    const { loginStatus} = useStore();
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [data, setData] = useState();
    const [total, setTotal] = useState();
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState(-1);
    const [sortByIdx, setSortByIdx] = useState(-1);
    const [searchOptionA, setSearchOptionA] = useState('');
    const [searchOptionB, setSearchOptionB] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);




    useEffect(() => { 

        const request = {
            page: page,
            perPage: perPage,
            sortBy: sortBy,
            sortOrder: sortOrder,
            searchOptionA: searchOptions[0],
            searchOptionB: searchOptions[1],
            sortByIdx: sortByIdx
        }
        axios.get('/api/board/list',{params:request})
            .then(res => { 
                console.log(res)
                if (!res.data.success) { 
                    alert(res.data.error)
                } else {
                    
                  
                    setData(res.data.posts);
                    setTotalPage(res.data.totalPage);
                    setTotal(res.data.total);
                }
                
            })
        }, [page,perPage,sortBy,sortOrder,searchOptions,sortByIdx])
        
       
        let pageNumber = [];
        for (let i = 1; i <= totalPage; i++) { 
            pageNumber.push(i);
            console.log(pageNumber)
        }
    const onPerPageHandler = (e) => { 
        e.preventDefault();
        setPerPage(e.target.value);
        setPage(1);
    }

    const onSearchOptionAHandler = (e) => { 
        e.preventDefault();
        setSearchOptionA(e.target.value);
    }
    const onSearchOptionsHandler = (e) => {
        e.preventDefault()
        setSearchOptions([searchOptionA, searchOptionB])
    }
    console.log(searchOptions)

    const setSortHandlaer = (e) => { 
        console.log(e);
        setSortBy(e);
        sortOrder===1 ? setSortOrder(-1) : setSortOrder(1); 
    }

    const setSortByIdxHandler = () => { 
       
        sortByIdx === 1 ? setSortByIdx(-1) : setSortByIdx(1); 
        
    }
    let i = 0;
    // ??? ?????? ?????????(??????????????????)?????????????????? ????????????????????? ????????? ??????????????????
    // ??? ?????????????????? ????????? ??????????????? 
    //????????? ????????? ???????????? ???????????????????????? ???????????? ????????? ??? ???????????? ????????? ??????????????????
    
    return (
        <>
            {loginStatus ? (
                <StyledFrame>
                    <p> any kind of feedback, suggestions or crirtics are welcome. leave your contact in message, I will call you as soon as possible</p>
                  
                <StyledTable>
                        <colgroup>
                            <col width="5%" />
                            <col width="60%"/>
                            <col width="15%"/>
                            <col width="20%"/>
                    </colgroup>
                    <thead>
                        <tr>
                                <th> <StyledSpan onClick={setSortByIdxHandler }>??????</StyledSpan></th>
                                <th> <StyledSpan onClick={()=>setSortHandlaer('title') }>??????</StyledSpan> </th>
                                <th> <StyledSpan onClick={()=>setSortHandlaer('writer') }>?????????</StyledSpan> </th>
                                <th> <StyledSpan onClick={()=>setSortHandlaer('createdAt') }>????????????</StyledSpan> </th>
                     </tr>
                    </thead>
                    <tbody>
                            {data && data.map((item, idx) => {
                                const realtime = new Date(item.createdAt).toLocaleString();
                                
                               
                                i++;
                                let index = item.index + (page - 1) * perPage;
                                return (
                                    <tr key={i}>
                                        <td>{index}</td>
                                        <td>{item.title}</td>
                                        <td>{item.writer.userid}</td>
                                        <td>{realtime}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                    </StyledTable>
                    <li >
                        <span key={page!==1? page-1 : 0 } onClick={() => { if (page !== 1) { setPage(page - 1) } }}>???</span>
                    {pageNumber.map((page) => (
                        <span key={page} onClick={() => setPage(page)}>{page}&nbsp;</span>
                        ))}
                        <span key={page!==totalPage? page+1 : totalPage+1} onClick={() => { if (page !== totalPage) { setPage(page + 1) } } }>???</span>
                        
                            </li>
                    
                        <select value={perPage} onChange={onPerPageHandler}>
                            <option value="10">10????????????</option>
                            <option value="15">15????????????</option>
                            <option value="20">20????????????</option>
                            <option value="30">30????????????</option>
                        </select>
                   
            
                    <div>

              
                    </div>
                      <form onSubmit={e=>onSearchOptionsHandler(e)}>
                        <select value={searchOptionA} onChange={onSearchOptionAHandler}>
                            <option value="">??????</option>
                            <option value="title">??????</option>
                            <option value="writer">?????????</option>
                        </select>
                        <input value={searchOptionB} onChange={(e)=> setSearchOptionB(e.target.value) }  type="text" />
                        <button type="submit">??????</button>
                    </form>
                    <Link to="/write">?????????</Link>
                
            </StyledFrame>
            ) : (<></>)}
     
      </>
      
  )
}

const StyledFrame= Styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%;
    height:100%;
    margin : 150px auto;
`
const StyledTable = Styled.table`
    width : 70%;
    text-align : center;
    border : 1px solid black;
    
    
    border-collapse: collapse;
    thead{
        background-color : black;
        tr{
            height : 50px;
        }
        th{
            color : #0F9B05;
             span:hover{
        color : white;
        }
        }
        /* th:nth-child(1){
            border-radius : 15px 0 0 0;
        }
        th:nth-child(4){
            border-radius : 0 15px 0 0;
        } */
    }
    tbody{
        border : 1px solid black;
    }
    tbody tr{
        height :40px;
    }
    tbody tr:nth-child(odd){
        background-color : #f2f2f2;

    }
`

const StyledSpan = Styled.span`
    cursor : pointer;
    font-size : 20px;
   
`