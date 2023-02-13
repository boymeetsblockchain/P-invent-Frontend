import "./productlist.scss";
import { SpinnerImg } from "../../loader/Loader";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import Search from "../../search/Search";
import { useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
function ProductList({products, isLoading}) {

  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredPoducts);
  const [search, setSearch] = useState("");
  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };
  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

   //   Begin Pagination
   const [currentItems, setCurrentItems] = useState([]);
   const [pageCount, setPageCount] = useState(0);
   const [itemOffset, setItemOffset] = useState(0);
   const itemsPerPage = 5;
 
   useEffect(() => {
     const endOffset = itemOffset + itemsPerPage;
 
     setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
     setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
   }, [itemOffset, itemsPerPage, filteredProducts]);
 
   const handlePageClick = (event) => {
     const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
     setItemOffset(newOffset);
   };
   //   End Pagination

  return (
  <div className="product-list">
    <hr />
    <div className="table">
        <div className="--flex-between --flex-dir-column">
        <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
          <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>
        {isLoading && <SpinnerImg />}
       <div className="table">
        {isLoading && ProductList.length === 0 ?(
          <p>-- No product found, please add a product...</p>
        ) :(
          <table>
          <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                currentItems.map((product,index)=>{
                    const { _id, name, category, price, quantity } = product;
                    return (
                       <tr key={_id}>
                        <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>
                        {"$"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {"$"}
                        {price * quantity}
                      </td>
                      <td className="icons">
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                          />
                        </span>
                      </td>
                       </tr>
                    )
                  })
                }
              </tbody>
          </table>
        )
        }
       </div>
       <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
    </div>
  </div>
  )
}

export default ProductList