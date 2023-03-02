import React from 'react'
import { Link} from 'react-router-dom'

const Entry = (props) => {
  return (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {props.id}
            </th>
            <td className="px-6 py-4">
              {props.mail}
            </td>
            <td className="px-6 py-4">
              {props.user}
            </td>
            <td className="px-6 py-4 text-right">
              <Link to="" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Details</Link>
          </td>
        </tr>
  )
}

export default Entry