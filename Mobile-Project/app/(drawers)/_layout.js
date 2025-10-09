import { DrawerItem, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";

export default function MyDrawer(){

    const router = useRouter();

    function CustomDrawerContent(props){
        return(
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label="Home"
                    onPress={() => {router.push("/Home")}}
                />
                <DrawerItem 
                    label="Settings"
                    onPress={() => {router.push("/setting")}}
                />
                <DrawerItem
                    label="Logout"
                    onPress={() => router.replace("/UserLogin")}
                />
            </DrawerContentScrollView>
        )
    }
    return(
        <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="(tabs)" options={{ title: "Savings Calculator" }}/>
        </Drawer>
    )
}