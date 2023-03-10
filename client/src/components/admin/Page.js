import React from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Page = (props) => {
  // const [page, setPage] = useState(1);
  // const handleChange = (event, value) => {
  //   console.log(value);
  //   setPage(value);
    
  // };

  return (
    <div className='flex justify-center mb-10'>
          <Stack spacing={2}>
              <Pagination page={props.page} count={props.pageCount} color="primary" onChange={(event,value)=>{
                props.setPage(value);
              }} />
          </Stack>
    </div>
  )
}

export default Page