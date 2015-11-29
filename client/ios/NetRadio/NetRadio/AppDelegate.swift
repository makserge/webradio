//
//  AppDelegate.swift
//  NetRadio
//
//  Created by Sergey on 16/09/14.
//  Copyright (c) 2014 Sergey. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, NSURLConnectionDataDelegate {

    var window: UIWindow?
    
    let baseHost: String = "http://192.168.15.1"
    
    let getModeTaskId: Byte = 1
    let getVolumeTaskId: Byte = 2
    let getVolumeMuteTaskId: Byte = 3
    
    var netData = NSMutableData()
    var currentNetworkTask: Byte = 1
    
    var currentMode: Int = 0
    var currentVolume: Int = 8
    var currentVolumeMute: Bool = false
    
    let networkMode: String = "network"
    let fmMode: String = "fm"
    let lineInMode: String = "linein"
    
    let networkTabPosition = 0;
    let fmTabPosition = 1;
    let lineInTabPosition = 2;
    
    let noConnectionTitle = "Network error"
    let noConnectionMessage = "No connection to server.\nPlease, check server settings"
    let retryButtonTitle = "Retry"
    let goToSettingsButtonTitle = "Go to settings"
    
    let retryButtonAction = 0
    let goToSettingsButtonAction = 1

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        loadData()
        return true
    }
    
    func loadData() {
        loadMode()
        
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    }
    
    func loadMode() {
        let url: NSURL = NSURL(string: baseHost + "/cgi-bin/netradio/items.cgi?action=mode")!
        var request = NSURLRequest(URL: url)
        NSURLConnection(request: request, delegate: self, startImmediately: true)
    }
    
    func loadVolume() {
        let url: NSURL = NSURL(string: baseHost + "/cgi-bin/netradio/items.cgi?action=volume")!
        var request = NSURLRequest(URL: url)
        NSURLConnection(request: request, delegate: self, startImmediately: true)
    }

    func loadMute() {
        let url: NSURL = NSURL(string: baseHost + "/cgi-bin/netradio/items.cgi?action=mute")!
        var request = NSURLRequest(URL: url)
        NSURLConnection(request: request, delegate: self, startImmediately: true)
    }
    
    func connection(connection: NSURLConnection!, didReceiveData data: NSData!) {
        netData.appendData(data)
    }
    
    func connectionDidFinishLoading(connection: NSURLConnection!) {
        var responseStr: String = NSString(data:self.netData, encoding:NSUTF8StringEncoding) as String
        //println(responseStr)
        
        if !responseStr.isEmpty {
            switch currentNetworkTask {
            case getModeTaskId:
            
                var data: String = responseStr.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet())
                
                setActiveTab(data)
                
                netData = NSMutableData()
                
                currentNetworkTask = getVolumeTaskId
            
                loadVolume()
            
            case getVolumeTaskId:
            
                currentVolume = responseStr.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet()).toInt()!
            
                println(currentVolume)
            
                netData = NSMutableData()
            
                currentNetworkTask = getVolumeMuteTaskId
            
                loadMute()

            
            case getVolumeMuteTaskId:
            
                currentVolumeMute = responseStr.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet()) == "1"
            
                println(currentVolumeMute)
            
            
                UIApplication.sharedApplication().networkActivityIndicatorVisible = false
             
            default:
                
                break
                
            }
        }
    }
    
    func connection(connection: NSURLConnection!, didFailWithError error: NSError!) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
        showNoConnectionMessage()
    }
    
    func setActiveTab(data: String) {
        if data == fmMode {
            currentMode = fmTabPosition
        }
        else if data == lineInMode {
            currentMode = lineInTabPosition
        }
        
        let tabBarController: UITabBarController = window!.rootViewController as UITabBarController
        tabBarController.selectedIndex = currentMode
    }

    func showNoConnectionMessage() {
        let alert = UIAlertView()
        alert.title = noConnectionTitle
        alert.message = noConnectionMessage
        alert.addButtonWithTitle(retryButtonTitle);
        alert.addButtonWithTitle(goToSettingsButtonTitle);
        alert.delegate = self
        alert.show()
    }
    
    func alertView(View: UIAlertView!, clickedButtonAtIndex buttonIndex: Int){
        
        switch buttonIndex {
            case retryButtonAction:
                loadData()
            case goToSettingsButtonAction:
                break
            default:
                loadData()
            break;
        }
    }
    
    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(application: UIApplication) {
        loadData()
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}

