import {
   CloseIcon,
   Icon,
   SidebarContainer,
   SidebarLink,
   SidebarMenu,
   SidebarRoute,
   SidebarWrapper,
   SideBtnWrap
} from './sidebar.styles';

export const Sidebar = ({ isOpen, toggle, data }: any) => {
   return (
      <SidebarContainer isOpen={isOpen} onClick={toggle}>
         <Icon onClick={toggle}>
            <CloseIcon />
         </Icon>
         <SidebarWrapper>
            <SidebarMenu>
               {data?.map((option: any, index: number) => {
                  return (
                     <SidebarLink key={index} to={option.link} onClick={toggle}>
                        {option.name}
                     </SidebarLink>
                  );
               })}
            </SidebarMenu>
            <SideBtnWrap>
               <span className="navbar-text">
                  <a
                     href="https://njmbio.vercel.app/"
                     target="_blank"
                     aria-label="Links"
                     rel="noreferrer"
                  >
                     <button className="vvd">
                        <span>Links</span>
                     </button>
                  </a>
               </span>
            </SideBtnWrap>
         </SidebarWrapper>
      </SidebarContainer>
   );
};
