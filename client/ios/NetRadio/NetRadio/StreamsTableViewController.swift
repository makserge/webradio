//
//  StreamsTableViewController.swift
//  NetRadio
//
//  Created by Sergey on 17/09/14.
//  Copyright (c) 2014 Sergey. All rights reserved.
//

import UIKit

class StreamsTableViewController: UITableViewController, NSURLConnectionDataDelegate {
    let baseHost: String = "http://192.168.15.1"
    
    let getItemsTaskId: Byte = 1
    let getCurrentItemTaskId: Byte = 2
    
    var itemsData: [DataItem] = []
    var netData = NSMutableData()
    var currentNetworkTask: Byte = 1
    var currentItem: Int = 1
    
    override func viewDidLoad() {
        super.viewDidLoad()

        configureToolbar()
        
        let view = UIView(frame: CGRectZero);
        self.tableView.tableFooterView = view;

        loadData()
    }
    
    func configureToolbar() {
        self.navigationItem.setRightBarButtonItem(UIBarButtonItem(barButtonSystemItem: .Search, target: self, action: "barButtonItemClicked:"), animated: true)
    }

    func loadData() {
        loadItems()
        
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    }

    func loadItems() {
        let url: NSURL = NSURL(string: baseHost + "/cgi-bin/netradio/items.cgi?action=network")!
        var request = NSURLRequest(URL: url)
        NSURLConnection(request: request, delegate: self, startImmediately: true)
    }
    
    func loadCurrentItem() {
        let url: NSURL = NSURL(string: baseHost + "/cgi-bin/netradio/items.cgi?action=curnetwork")!
        var request = NSURLRequest(URL: url)
        NSURLConnection(request: request, delegate: self, startImmediately: true)
    }
    
    func connection(connection: NSURLConnection!, didReceiveData data: NSData!) {
        netData.appendData(data)
    }
    
    func connectionDidFinishLoading(connection: NSURLConnection!) {
        var responseStr: String = NSString(data:self.netData, encoding:NSUTF8StringEncoding) as String
        //NSLog(responseStr)
        
        if !responseStr.isEmpty {
            if currentNetworkTask == getItemsTaskId {
                parseItemsData(responseStr)
                
                netData = NSMutableData()
                
                currentNetworkTask = getCurrentItemTaskId
                loadCurrentItem()
            }
            else {
                currentItem = responseStr.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet()).toInt()!

                tableView.reloadData()
                
                setSelection()
                
                UIApplication.sharedApplication().networkActivityIndicatorVisible = false
            }
        }
    }
    
    func connection(connection: NSURLConnection!, didFailWithError error: NSError!) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    func parseItemsData(data: String) {
        var array : [String] = data.componentsSeparatedByString(";")
        
        var subArray: [String]
        var item: DataItem
        
        for dataItem in array {
            subArray = dataItem.componentsSeparatedByString("|")
            item = DataItem(title: subArray[0], value: subArray[1])
            itemsData.append(item)
        }
    }
    
    func setSelection() {
        let indexPath: NSIndexPath = NSIndexPath(forRow: currentItem - 1, inSection: 0)
        tableView.selectRowAtIndexPath(indexPath, animated: false, scrollPosition: .None)
        
        let indexPathsForVisibleRows = tableView.indexPathsForVisibleRows() as [NSIndexPath]
        if find(indexPathsForVisibleRows, indexPath) != nil {
            tableView.scrollToNearestSelectedRowAtScrollPosition(.Middle, animated: true)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return itemsData.count
    }

    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cellId: String = "Cell"
        var cell: UITableViewCell = tableView.dequeueReusableCellWithIdentifier(cellId) as UITableViewCell
        if let path = indexPath as NSIndexPath? {
            let row: Int = path.row
            
            cell.textLabel?.text = itemsData[row].title as String
            cell.detailTextLabel?.text = itemsData[row].value as String
        }
        return cell
    }
    

    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the specified item to be editable.
        return false
    }
    

    /*
    // Override to support editing the table view.
    override func tableView(tableView: UITableView!, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath!) {
        if editingStyle == .Delete {
            // Delete the row from the data source
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(tableView: UITableView!, moveRowAtIndexPath fromIndexPath: NSIndexPath!, toIndexPath: NSIndexPath!) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(tableView: UITableView!, canMoveRowAtIndexPath indexPath: NSIndexPath!) -> Bool {
        // Return NO if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue!, sender: AnyObject!) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
    }
    */

}
