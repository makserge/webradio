//
//  FmPresetsTableViewController.swift
//  NetRadio
//
//  Created by Sergey on 17/09/14.
//  Copyright (c) 2014 Sergey. All rights reserved.
//

import UIKit

class FmPresetsTableViewController: UITableViewController {
    let baseHost: String = "http://192.168.15.1"
    var itemsData: [DataItem] = []
    var netData = NSMutableData()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let view = UIView(frame: CGRectZero);
        self.tableView.tableFooterView = view;

        loadData()
    }
    
    func loadData() {
        let url: NSURL = NSURL(string: baseHost + "/cgi-bin/netradio/items.cgi?action=fm")!
        var request = NSURLRequest(URL: url)
        NSURLConnection(request: request, delegate: self, startImmediately: true)
        
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    }
    
    func connection(connection: NSURLConnection!, didReceiveData data: NSData!) {
        self.netData.appendData(data)
    }
    
    func connectionDidFinishLoading(connection: NSURLConnection!) {
        var responseStr: String = NSString(data:self.netData, encoding:NSUTF8StringEncoding) as String
        NSLog(responseStr)
        
        if !responseStr.isEmpty {
            var array : [String] = responseStr.componentsSeparatedByString(";")
            
            var subArray: [String]
            var item: DataItem
            
            for dataItem in array {
                subArray = dataItem.componentsSeparatedByString("|")
                item = DataItem(title: subArray[0], value: subArray[1])
                itemsData.append(item)
            }
            self.tableView.reloadData()
        }
        
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
    
    func connection(connection: NSURLConnection!, didFailWithError error: NSError!) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    }
        
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Table view data source
    
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        // #warning Potentially incomplete method implementation.
        // Return the number of sections.
        return 1
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete method implementation.
        // Return the number of rows in the section.
        return itemsData.count
    }
    
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cellId: String = "Cell"
        var cell: UITableViewCell = tableView.dequeueReusableCellWithIdentifier(cellId) as UITableViewCell
        if let path = indexPath as NSIndexPath? {
            cell.textLabel?.text = itemsData[path.row].title as String
            cell.detailTextLabel?.text = itemsData[path.row].value as String
        }
        return cell
    }
    
    
    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the specified item to be editable.
        return true
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
