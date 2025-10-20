import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyDrawer(){

    const router = useRouter();

    const logOut = async () =>{
        try{
            await AsyncStorage.removeItem("token");
            router.replace("/UserLogin");
        } catch(error){
            console.log("Logout error", error.message);
        }
        console.log("Logout done");
    }

    function CustomDrawerContent(props){
        return(
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label="Home"
                    onPress={() => {router.push("/Home")}}
                    labelStyle={{
                        fontSize:18
                    }}
                />
                <DrawerItem 
                    label="Settings"
                    onPress={() => {router.push("/setting")}}
                    labelStyle={{
                        fontSize:18
                    }}
                />
                <DrawerItem
                    label="Logout"
                    onPress={logOut}
                    labelStyle={{
                        fontSize:18
                    }}
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